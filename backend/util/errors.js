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

export class ResponseError extends Error {
  /**
   * @param {number} code
   */
  constructor(code) {
    super(`Response code ${code}`);
    this.code = code;
  }
}
