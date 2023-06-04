import { stat } from 'node:fs/promises';
import ffprobe from 'ffprobe';
import mime from 'mime-types';
import LoadConfig from '../util/load-configs.js';

const { ffprobe_path: FFPROBE_PATH } = LoadConfig('api');

/**
 * Reads file with ffprobe, returns length of audiotrack in seconds. Rejects with errors
 */
export default function ProbeAudioFile(filename: string): Promise<{ duration: number; mimeType: string }> {
  return stat(filename).then(
    (stats) => {
      if (!stats.isFile()) return Promise.reject(new Error(`Pulling duration from file ${filename} – not a file`));

      return ffprobe(filename, { path: FFPROBE_PATH }).then((probeRes) => {
        const stream = probeRes?.streams?.filter((filterStream) => filterStream.codec_type === 'audio')?.[0];
        if (!stream) return Promise.reject(new Error(`Pulling duration from file ${filename} – not valid stream`));

        const duration = parseFloat(
          (typeof stream.duration === 'string' ? parseFloat(stream.duration) : stream.duration || 0).toFixed(3)
        );
        const mimeType = mime.contentType(stream.codec_name || '') || 'audio/mpeg';

        return Promise.resolve({ duration, mimeType });
      });
    },
    () => Promise.reject(new Error(`Pulling duration from file ${filename} – doesn't exist`))
  );
}
