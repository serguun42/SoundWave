import { IncomingMessage, ServerResponse } from 'http';

/** Sends HTTP code with body of same content */
export type SendCode = (code: number) => void;

/** Sends any payload with HTTP Code */
export type SendPayload = (code: number, data: string | Buffer | any) => void;

export type APIError = Error | import('../util/errors.js').JSONParseError | import('../util/errors.js').ResponseError;

export type APIMethodParams = {
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
  path: string[];
  queries: { [queryName: string]: string | true };
  cookies: { [cookieName: string]: string };
  sendCode: SendCode;
  sendPayload: SendPayload;
  wrapError: (e: APIError) => void;
  endWithError: (code: number, data?: any) => Promise<APIError>;
};

export type APIMethod = (params: APIMethodParams) => void;

export type APIMethodsStorage = {
  [pathPart: string]: APIMethod | APIMethodsStorage;
};
