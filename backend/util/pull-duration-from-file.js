import { stat } from 'node:fs/promises';
import ffprobe from 'ffprobe';
import LoadConfig from './load-configs.js';

const { ffprobe_path: FFPROBE_PATH } = LoadConfig('api');

/**
 * Reads file with ffprobe, returns length of audiotrack in seconds. Rejects with errors
 *
 * @param {string} filename
 * @returns {Promise<number>}
 */
const PullDurationFromFile = (filename) =>
  stat(filename).then(
    (stats) => {
      if (!stats.isFile()) return Promise.reject(new Error(`Pulling duration from file ${filename} – not a file`));

      return ffprobe(filename, { path: FFPROBE_PATH }).then((probeRes) => {
        const duration = parseFloat((parseFloat(probeRes?.streams?.[0]?.duration) || 0).toFixed(3));

        if (!duration) return Promise.reject(new Error(`Pulling duration from file ${filename} – not valid`));

        return Promise.resolve(duration);
      });
    },
    () => Promise.reject(new Error(`Pulling duration from file ${filename} – doesn't exist`))
  );

export default PullDurationFromFile;
