import { IncomingMessage } from 'node:http';
import { JSONParseError } from './errors.js';

export default function ReadPayload<TReturnType = string>(
  req: IncomingMessage,
  payloadType: 'text' | 'json' = 'text'
): Promise<TReturnType> {
  return new Promise((resolve: (value: string) => void, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => chunks.push(chunk));

    req.on('error', (e) => reject(e));

    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
  }).then((readPayloadBody) => {
    if (payloadType === 'json')
      try {
        const parsedJSON = JSON.parse(readPayloadBody);
        return Promise.resolve(parsedJSON);
      } catch (e) {
        return Promise.reject(new JSONParseError(readPayloadBody));
      }

    return Promise.resolve(readPayloadBody);
  });
}
