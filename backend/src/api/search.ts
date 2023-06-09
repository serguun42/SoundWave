import { SearchPlaylistsByRegexp, SearchTracksByRegexp } from '../database/methods.js';
import { APIMethod } from '../types/api.js';
import { SearchResult } from '../types/entities.js';
import LogMessageOrError from '../util/log.js';

const SearchByText: APIMethod = ({ req, queries, sendCode, sendPayload, wrapError }) => {
  if (req.method !== 'GET') {
    sendCode(405);
    return;
  }

  const { text } = queries;
  if (!text || typeof text !== 'string') {
    sendPayload(406, 'No text query');
    return;
  }

  const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  Promise.all([
    SearchTracksByRegexp(escapedText).catch((e) => {
      LogMessageOrError(e);
      return Promise.resolve([]);
    }),
    SearchPlaylistsByRegexp(escapedText).catch((e) => {
      LogMessageOrError(e);
      return Promise.resolve([]);
    }),
  ])
    .then(([tracks, playlists]) => {
      const searchResults: SearchResult[] = [];

      tracks.forEach((track) =>
        searchResults.push({
          entity: 'track',
          uuid: track.uuid,
          title: track.title,
          duration: track.duration,
          artist_name: track.artist_name,
        })
      );

      playlists.forEach((playlist) =>
        searchResults.push({
          entity: 'playlist',
          uuid: playlist.uuid,
          title: playlist.title,
          duration: playlist.sum_duration,
        })
      );

      if (!searchResults?.length) return sendPayload(404, []);

      return sendPayload(200, searchResults);
    })
    .catch(wrapError);
};

export default SearchByText;
