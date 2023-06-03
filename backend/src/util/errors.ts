/* eslint-disable max-classes-per-file */
export class JSONParseError extends Error {
  parsing: string;

  constructor(parsing: string) {
    super(`Cannot parse ${parsing}`);
    this.parsing = parsing;
  }
}

export class PayloadTooLargeError extends Error {
  maxSize: number;

  constructor(maxSize: number) {
    super(`Payload is too large, was expecting ${maxSize}B at max`);
    this.maxSize = maxSize;
  }
}

export class ResponseError extends Error {
  code: number;

  constructor(code: number) {
    super(`Response code ${code}`);
    this.code = code;
  }
}

export class ResponseExtendedError extends Error {
  code: number;

  data: unknown;

  constructor(code: number, data: unknown) {
    super(`Response code ${code}`);
    this.code = code;
    this.data = data;
  }
}
