/**
 * Check whether given buffer is a PNG
 *
 * @see https://github.com/sindresorhus/is-png
 * @author sindresorhus
 * @license MIT
 * @param {Buffer} buffer
 * @returns {boolean}
 */
export const IsPNG = (buffer) => {
  if (!buffer || buffer.length < 8) return false;

  return (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  );
};

/**
 * Check whether given buffer is a PNG
 *
 * @see https://en.wikipedia.org/wiki/List_of_file_signatures
 * @param {Buffer} buffer
 * @returns {boolean}
 */
export const IsJPEG = (buffer) => {
  if (!buffer || buffer.length < 8) return false;

  return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
};
