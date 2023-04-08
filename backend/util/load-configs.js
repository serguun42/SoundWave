import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import IS_DEV from './is-dev.js';
import LogMessageOrError from './log.js';

/** @type {{ [key in import('../types/configs').ConfigName]: import('../types/configs').GenericConfig<key> }} */
const CONFIG_STORAGE = {};

/** @type {import('../types/configs').ConfigName[]} */
const ALL_CONFIG_NAMES = ['hashing', 'db'];

/**
 * @template {import('../types/configs').ConfigName} T
 * @param {T} configName
 * @returns {import('../types/configs').GenericConfig<T>}
 */
const LoadConfig = (configName) => {
  if (!ALL_CONFIG_NAMES.includes(configName)) return {};

  const configFilePath = join(process.cwd(), 'config', `${configName}${IS_DEV ? '.dev' : ''}.json`);

  try {
    const rawJson = CONFIG_STORAGE[configName] || readFileSync(configFilePath).toString();
    CONFIG_STORAGE[configName] = rawJson;
    return JSON.parse(rawJson);
  } catch (e) {
    LogMessageOrError(e);
    return {};
  }
};

export const LoadHashingConfig = () => LoadConfig('hashing');

export const LoadDBConfig = () => LoadConfig('db');
