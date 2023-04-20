import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import mime from 'mime-types';
import { ResponseError } from '../util/errors.js';
import LoadConfig from '../util/load-configs.js';
import { IsPNG, IsJPEG } from '../util/is-image.js';
import { GetTrack } from '../database/methods.js';

const { data_storage_root: DATA_STORAGE_ROOT } = LoadConfig('api');

/**
 * Saves uploading file based on type & UUID, returns number of bytes received and created file
 *
 * @param {import('../types/api').APIMethodParams} params
 * @param {'audio' | 'cover'} type
 * @param {string} uuid
 * @returns {Promise<>}
 */
const SendFile = ({ req, res }, type, uuid) => {
  if (type !== 'audio' && type !== 'cover') return Promise.reject(new Error('Wrong sending file type'));

  const filename = join(DATA_STORAGE_ROOT, type, uuid);

  return stat(filename).then(
    (stats) => {
      if (!stats.isFile()) return Promise.reject(new ResponseError(404));

      if (type === 'cover') {
        return readFile(filename).then((coverBuffer) => {
          res.statusCode = 200;
          res.setHeader('Content-Length', coverBuffer.length);
          res.setHeader('Cache-Control', 'public, max-age=604800');
          res.setHeader(
            'Content-Type',
            mime.contentType(IsPNG(coverBuffer) ? 'png' : IsJPEG(coverBuffer) ? 'jpeg' : 'webp')
          );
          res.end(coverBuffer);
        });
      }

      return GetTrack(uuid).then((track) => {
        if (!track) return Promise.reject(new ResponseError(404));

        res.setHeader('Cache-Control', 'public, max-age=604800');
        res.setHeader('Content-Type', track.mime_type || 'audio/mpeg');

        const rangeHeader = req.headers.range;

        if (rangeHeader) {
          const parts = rangeHeader.replace(/bytes=/i, '').split('-');
          const start = parseInt(parts[0]) || 0;
          const end = parseInt(parts[1]) || stats.size - 1;
          const chunkSize = end - start + 1;

          res.statusCode = 206;
          res.setHeader('Content-Range', `bytes ${start}-${end}/${stats.size}`);
          res.setHeader('Accept-Ranges', 'bytes');
          res.setHeader('Content-Length', chunkSize);
          createReadStream(filename, { start, end }).pipe(res);
        } else {
          return readFile(filename).then((audioBuffer) => {
            res.statusCode = 200;
            res.end(audioBuffer);
          });
        }

        return Promise.resolve();
      });
    },
    () => Promise.reject(new ResponseError(404))
  );
};

export default SendFile;
