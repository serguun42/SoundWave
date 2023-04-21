/**
 * @param {import('http').IncomingHttpHeaders} headers
 * @returns {{ [cookieName: string]: string }}
 */
export const ParseCookie = (headers) => {
  const cookies = headers?.cookie;
  if (!cookies) return {};

  const returningList = {};

  cookies.split(';').forEach((cookie) => {
    const [name, ...valueParts] = cookie.split('=');

    try {
      returningList[name.trim()] = decodeURIComponent(valueParts.join('=')).trim();
    } catch (e) {
      returningList[name.trim()] = valueParts.join('=').trim();
    }
  });

  return returningList;
};

/**
 * @param {string} query
 * @returns {{ [queryName: string]: string | true }}
 */
export const ParseQuery = (query) => {
  if (!query) return {};

  const returningList = {};

  try {
    const searchParams = new URLSearchParams(query);
    searchParams.forEach((value, key) => {
      returningList[key] = value || true;
    });
  } catch (e) {
    query
      .toString()
      .replace(/^\?/, '')
      .split('&')
      .forEach((queryPair) => {
        try {
          if (queryPair.split('=')[1])
            returningList[queryPair.split('=')[0]] = decodeURIComponent(queryPair.split('=')[1]);
          else returningList[queryPair.split('=')[0]] = true;
        } catch (_) {
          returningList[queryPair.split('=')[0]] = queryPair.split('=')[1] || true;
        }
      });
  }

  return returningList;
};

/**
 * @param {string | string[]} path
 * @returns {string[]}
 */
export const ParsePath = (path) => {
  if (Array.isArray(path))
    return path
      .map((part) => part.toString().split('/'))
      .flat()
      .filter(Boolean);

  if (typeof path === 'string') return path.replace().split('/').filter(Boolean);

  return path;
};

/**
 * @param {string} hrefOrPathname
 * @returns {URL}
 */
export const SafeURL = (hrefOrPathname) => {
  if (!hrefOrPathname || typeof hrefOrPathname !== 'string') return new URL('https://example.com');

  try {
    const url = new URL(hrefOrPathname);
    url.pathname = url.pathname.replace(/\/+/g, '/');
    return url;
  } catch (e) {
    /* empty */
  }

  try {
    const url = new URL(hrefOrPathname, 'https://example.com');
    url.pathname = url.pathname.replace(/\/+/g, '/');
    return url;
  } catch (e) {
    /* empty */
  }

  return new URL('https://example.com');
};

/**
 * @param {string} raw
 * @returns {string}
 */
export const SafeEscape = (raw) => {
  if (typeof raw !== 'string') return raw;

  return raw
    .replace(/(\/+)/gi, '/')
    .replace(/\.\.%2F/gi, '')
    .replace(/\.\.\//g, '');
};

/**
 * @param {string} raw
 * @returns {string}
 */
export const SafeDecode = (raw) => {
  if (typeof raw !== 'string') return raw;

  try {
    const decoded = decodeURIComponent(raw);
    return SafeEscape(decoded);
  } catch (e) {
    return SafeEscape(raw);
  }
};
