import { IncomingMessage } from 'node:http';
import { createWriteStream, WriteStream } from 'node:fs';
import { join } from 'node:path';
import LoadConfig from '../util/load-configs.js';
import { PayloadTooLargeError } from '../util/errors.js';

const { data_storage_root: DATA_STORAGE_ROOT } = LoadConfig('api');

export const B = 1;
export const KB = 1024 * B;
export const MB = 1024 * KB;

/**
 * Pipes request payload to writing stream, manages size, returns number of bytes received
 */
function StreamPayload(req: IncomingMessage, target: WriteStream, maxSize = MB): Promise<number> {
  return new Promise((resolve, reject) => {
    if (!(target instanceof WriteStream)) {
      reject(new Error('Cannot write to target writable stream'));
      return;
    }

    let received = 0;

    const OnDataHandle = (chunk: Buffer) => {
      received += chunk.length;

      if (received > maxSize) {
        req.removeListener('data', OnDataHandle);
        reject(new PayloadTooLargeError(maxSize));
      }
    };

    req.on('data', OnDataHandle);

    req.on('error', (e) => {
      req.removeListener('data', OnDataHandle);
      reject(e);
    });

    req.pipe(target);

    req.on('end', () => resolve(received));
  });
}

/**
 * Saves uploading file based on type & UUID, returns number of bytes received and created file
 */
export default function SaveUpload(
  req: IncomingMessage,
  type: 'audio' | 'cover',
  uuid: string
): Promise<{ received: number; filename: string }> {
  if (type !== 'audio' && type !== 'cover') return Promise.reject(new Error('Wrong saving upload type'));

  const filename = join(DATA_STORAGE_ROOT, type, uuid);
  const savingStream = createWriteStream(filename);

  return StreamPayload(req, savingStream, type === 'audio' ? MB * 16 : MB).then((received) =>
    Promise.resolve({
      received,
      filename,
    })
  );
}
