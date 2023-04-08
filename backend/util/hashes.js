import { pbkdf2, randomBytes } from 'node:crypto';
import { LoadHashingConfig } from './load-configs.js';

const { iterations, key_length: keyLength, digest, salt_length: saltLength } = LoadHashingConfig();

/**
 * Creates random HEX representation for new salt
 * @returns {string}
 */
export const CreateSalt = () => randomBytes(saltLength).toString('hex');

/**
 * Hashes password with PBKDF2
 * @param {string} password
 * @param {string} salt
 * @returns {Promise<string>}
 */
export const GetPasswordHash = (password, salt) =>
  new Promise((resolve, reject) => {
    pbkdf2(password, salt, iterations, keyLength, digest, (e, derivedKey) => {
      if (e) reject(e);
      else resolve(derivedKey.toString('hex'));
    });
  });
