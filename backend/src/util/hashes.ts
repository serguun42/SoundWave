import { pbkdf2, randomBytes } from 'node:crypto';
import LoadConfig from './load-configs.js';

const {
  iterations,
  digest,
  salt_length_bytes: saltLength,
  password_key_length_bytes: passwordHashByteLength,
  session_token_length_bytes: sessionTokenHashByteLength,
} = LoadConfig('hashing');

/**
 * Creates random HEX representation for new salt
 */
export const CreateSalt = () => randomBytes(saltLength).toString('hex');

/**
 * Creates session token with PBKDF2
 */
export const CreateSessionToken = (username: string): Promise<string> =>
  new Promise((resolve, reject) => {
    pbkdf2(
      `${username}${Date.now()}`,
      CreateSalt(),
      iterations,
      sessionTokenHashByteLength,
      digest,
      (e, derivedKey) => {
        if (e) reject(e);
        else resolve(derivedKey.toString('hex'));
      }
    );
  });

/**
 * Hashes password with PBKDF2
 */
export const HashPassword = (password: string, salt: string): Promise<string> =>
  new Promise((resolve, reject) => {
    pbkdf2(password, salt, iterations, passwordHashByteLength, digest, (e, derivedKey) => {
      if (e) reject(e);
      else resolve(derivedKey.toString('hex'));
    });
  });
