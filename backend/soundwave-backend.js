import http, { STATUS_CODES } from 'node:http';
import mime from 'mime-types';
import LoadConfig from './util/load-configs.js';
import { ParseCookie, ParsePath, ParseQuery, SafeDecode, SafeURL } from './util/urls.js';
import RateLimit from './util/rate-limit.js';
import RunAPIMethod from './api/index.js';

const { port, version } = LoadConfig('api');

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

http
  .createServer((req, res) => {
    if (RateLimit(req)) return SendCode(429);

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
    });
  })
  .listen(port);
