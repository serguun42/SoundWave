export type HashingConfig = {
  /** Iterations number for PBKDF2 */
  iterations: number;
  /** HMAC digest algorithm */
  digest: string;
  /** Size of creating salt in BYTES */
  salt_length_bytes: number;
  /** Length of key deriving from password with PBKDF2 in BYTES */
  password_key_length_bytes: number;
  /** Length of session token in BYTES */
  session_token_length_bytes: number;
};

export type DBConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export type APIConfig = {
  port: number;
  version: string;
  minute_limit: number;
  hour_limit: number;
  domain: string;
  /** Fill this to enable TLS for local API service */
  secure?: {
    /** Location of TLS cert file */
    cert: string;
    /** Location of TLS key file */
    key: string;
  };
};

export type Configs = {
  hashing: HashingConfig;
  db: DBConfig;
  api: APIConfig;
};

export type ConfigName = keyof Configs;

export type GenericConfig<T extends ConfigName> = Configs[T];
