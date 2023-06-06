import mime from 'mime-types';
import { APIMethodParams } from '../types/api.js';

// eslint-disable-next-line max-len
const DEFAULT_COVER_BODY = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="m393,-120q-63,0 -106.5,-43.5t-43.5,-106.5q0,-63 43.5,-106.5t106.5,-43.5q28,0 50.5,8t39.5,22l0,-450l234,0l0,135l-174,0l0,435q0,63 -43.5,106.5t-106.5,43.5z" /><rect height="1024" width="1024" y="0" x="0" fill="#999999" rx="64" /><path fill="#ffffff" d="m393,840q-63,0 -106.5,-43.5t-43.5,-106.5q0,-63 43.5,-106.5t106.5,-43.5q28,0 50.5,8t39.5,22l0,-450l234,0l0,135l-174,0l0,435q0,63 -43.5,106.5t-106.5,43.5z" /></svg>`;

/**
 * Sends default playlist and track cover
 */
export default function SendDefaultCover({ res }: Pick<APIMethodParams, 'res'>): Promise<void> {
  res.statusCode = 200;
  res.setHeader('Content-Length', DEFAULT_COVER_BODY.length);
  res.setHeader('Cache-Control', 'public, max-age=604800');
  res.setHeader('Content-Type', mime.contentType('svg').toString());
  res.end(DEFAULT_COVER_BODY);

  return Promise.resolve();
}
