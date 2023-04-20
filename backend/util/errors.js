/* eslint-disable max-classes-per-file */
export class JSONParseError extends Error {
  /**
   * @param {string} parsing
   */
  constructor(parsing) {
    super(`Cannot parse ${parsing}`);
    this.parsing = parsing;
  }
}

export class PayloadTooLargeError extends Error {
  /**
   * @param {number} maxSize
   */
  constructor(maxSize) {
    super(`Payload is too large, was expecting ${maxSize}B at max`);
    this.maxSize = maxSize;
  }
}

export class ResponseError extends Error {
  /**
   * @param {number} code
   */
  constructor(code) {
    super(`Response code ${code}`);
    this.code = code;
  }
}

export class ResponseExtendedError extends Error {
  /**
   * @param {number} code
   * @param {any} data
   */
  constructor(code, data) {
    super(`Response code ${code}`);
    this.code = code;
    this.data = data;
  }
}
