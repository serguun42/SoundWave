export type UserDB = {
  /** Limited with 64 chars */
  username: string;
  /** Limited with hashing config */
  password_hash: string;
  /** Limited with hashing config */
  password_salt: string;
  is_admin: boolean;
};
