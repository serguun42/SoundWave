/**
 * @param {import("http").IncomingMessage} req
 * @param {"text" | "json"} [type="text"]
 * @returns {Promise<string>}
 */
const ReadPayload = (req, type = 'text') =>
  new Promise((resolve, reject) => {
    const chunks = [];

    req.on('data', (chunk) => chunks.push(chunk));

    req.on('error', (e) => reject(e));

    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
  }).then((ReadPayloadBody) => {
    if (type !== 'json' && type !== 'text') type = 'text';

    if (type === 'json')
      return new Promise((resolve, reject) => {
        try {
          const parsedJSON = JSON.parse(ReadPayloadBody);
          resolve(parsedJSON);
        } catch (e) {
          reject(e);
        }
      });

    return Promise.resolve(ReadPayloadBody);
  });

export default ReadPayload;
