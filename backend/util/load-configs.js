import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import IS_DEV from './is-dev.js';
import LogMessageOrError from './log.js';

const CONFIG_STORAGE = {};

/**
 * @template {import('../types/configs').ConfigName} T
 * @param {T} configName
 * @returns {import('../types/configs').GenericConfig<T>}
 */
const LoadConfig = (configName) => {
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

export default LoadConfig;
