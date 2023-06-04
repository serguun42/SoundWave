import { IncomingMessage } from 'node:http';
import IS_DEV from './is-dev.js';
import LoadConfig from './load-configs.js';

const SECOND = 100;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;

const { hour_limit: HOUR_CONNECTIONS_LIMIT, minute_limit: MINUTE_CONNECTIONS_LIMIT } = LoadConfig('api');

/** @type {{ [ip: string]: number }} */
const MINUTE_IPS: Record<string, number> = {};

/** @type {{ [ip: string]: number }} */
const HOUR_IPS: Record<string, number> = {};

/**
 * Returns `TRUE` if connection should be limited (via 429 Too Many Requests).
 * Returns `FALSE` if everything is okay.
 *
 * @param {import('http').IncomingMessage} req
 * @returns {boolean}
 */
export default function RateLimit(req: IncomingMessage) {
  if (IS_DEV) return false;

  const ip = Array.isArray(req.headers?.['x-real-ip'])
    ? req.headers?.['x-real-ip']?.[0]
    : req.headers?.['x-real-ip'] || req.socket?.remoteAddress || '';
  if (!ip) return true;

  if (!MINUTE_IPS[ip]) MINUTE_IPS[ip] = 1;
  else ++MINUTE_IPS[ip];

  if (!HOUR_IPS[ip]) HOUR_IPS[ip] = 1;
  else ++HOUR_IPS[ip];

  setTimeout(() => --MINUTE_IPS[ip], MINUTE);
  setTimeout(() => --HOUR_IPS[ip], HOUR);

  if (MINUTE_IPS[ip] > MINUTE_CONNECTIONS_LIMIT) return true;
  if (HOUR_IPS[ip] > HOUR_CONNECTIONS_LIMIT) return true;

  return false;
}
