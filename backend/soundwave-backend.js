import http, { STATUS_CODES } from 'node:http';
import https from 'node:https';
import { readFileSync } from 'node:fs';
import mime from 'mime-types';
import LoadConfig from './util/load-configs.js';
import { ParseCookie, ParsePath, ParseQuery, SafeDecode, SafeURL } from './util/urls.js';
import RateLimit from './util/rate-limit.js';
import { ResponseError, JSONParseError, PayloadTooLargeError, ResponseExtendedError } from './util/errors.js';
import RunAPIMethod from './api/index.js';
import LogMessageOrError from './util/log.js';

const { port, version, secure } = LoadConfig('api');

/**
 * @param {import('http').ServerResponse<import('http').IncomingMessage> } res
 * @param {number} code
 * @param {string | Buffer | Object} data
 */
const SendPayload = (res, code, data) => {
  res.statusCode = code;

  if (data instanceof Buffer || typeof data === 'string') {
    const dataToSend = data.toString();
    res.end(dataToSend);
  } else {
    const dataToSend = JSON.stringify(data);
    res.setHeader('Content-Type', mime.contentType('json'));
    res.end(dataToSend);
  }
};

/**
 * @param {import('http').ServerResponse<import('http').IncomingMessage> } res
 * @param {number} code
 * @returns {void}
 */
const SendCode = (res, code) => {
  res.statusCode = code || 500;
  res.end(`${code || 500} ${STATUS_CODES[code || 500]}`);
};

/**
 * @param {import('http').ServerResponse<import('http').IncomingMessage> } res
 * @param {import('./types/api').APIError} e
 */
const CatchResponse = (res, e) => {
  if (e instanceof JSONParseError) e = new ResponseExtendedError(406, 'Cannot parse JSON');
  if (e instanceof PayloadTooLargeError) e = new ResponseError(413);

  if (e instanceof ResponseExtendedError) {
    SendPayload(res, e.code || 500, e.data || '500 Internal Server Error');
  } else if (e instanceof ResponseError) {
    SendCode(res, e.code || 500);
  } else {
    LogMessageOrError(e);
    SendCode(res, 500);
  }
};

/** @type {import('http').RequestListener} */
const ServerHandle = (req, res) => {
  if (RateLimit(req)) return SendCode(429);

  const accessedFromOrigin = req.headers.origin;
  if (accessedFromOrigin && SafeURL(accessedFromOrigin).origin === accessedFromOrigin)
    res.setHeader('Access-Control-Allow-Origin', accessedFromOrigin);
  else res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '1000');

  if (req.method === 'OPTIONS') {
    res.setHeader(
      'Access-Control-Allow-Headers',
      req.headers['access-control-request-headers'] ||
        [
          'Content-Length',
          'Content-Security-Policy',
          'Content-Type',
          'Date',
          'Referrer-Policy',
          'Server',
          'Set-Cookie',
          'Strict-Transport-Security',
          'X-Content-Type-Options',
          'X-Xss-Protection',
        ].join(', ')
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.statusCode = 200;
    return res.end('');
  }

  const pathname = SafeDecode(SafeURL(req.url).pathname);
  const path = ParsePath(pathname);
  const queries = ParseQuery(SafeURL(req.url).search);
  const cookies = ParseCookie(req.headers);

  res.setHeader('Content-Type', mime.contentType('txt'));

  if (path[0] !== 'api') return SendCode(res, 404);
  if (path[1] !== `v${version}`) return SendPayload(res, 410, `Current API version is ${version}`);

  return RunAPIMethod({
    req,
    res,
    path,
    queries,
    cookies,
    sendCode: (...args) => SendCode(res, ...args),
    sendPayload: (...args) => SendPayload(res, ...args),
    wrapError: (...args) => CatchResponse(res, ...args),
    endWithError: (code, data) =>
      Promise.reject(data ? new ResponseExtendedError(code, data) : new ResponseError(code)),
  });
};

if (secure?.cert && secure?.key)
  https
    .createServer(
      {
        cert: readFileSync(secure.cert),
        key: readFileSync(secure.key),
      },
      ServerHandle
    )
    .listen(port);
else http.createServer(ServerHandle).listen(port);
