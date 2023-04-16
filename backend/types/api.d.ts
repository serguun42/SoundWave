import { IncomingMessage, ServerResponse } from 'http';

/** Sends HTTP code with body of same content */
export type SendCode = (code: number) => void;

/** Sends any payload with HTTP Code */
export type SendPayload = (code: number, data: string | Buffer | any) => void;

export type APIMethodParams = {
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage>;
  path: string[],
  queries: { [queryName: string]: string | true };
  cookies: { [cookieName: string]: string };
  sendCode: SendCode;
  sendPayload: SendPayload;
};

export type APIMethod = (params: APIMethodParams) => void;

export type APIMethodsStorage = {
  [pathPart: string]: APIMethod | APIMethodsStorage;
};