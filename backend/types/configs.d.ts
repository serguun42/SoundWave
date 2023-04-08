export type HashingConfig = {
  /** Iterations number for PBKDF2 */
  iterations: number;
  /** Length for deriving key for PBKDF2 in BYTES */
  key_length: number;
  /** HMAC digest algorithm */
  digest: string;
  /** Length for using salt in BYTES */
  salt_length: number;
};

export type DBConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

export type Configs = {
  hashing: HashingConfig;
  db: DBConfig;
};

export type ConfigName = keyof Configs;

export type GenericConfig<T extends ConfigName> = Configs[T];
