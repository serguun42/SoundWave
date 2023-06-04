import { IncomingHttpHeaders } from 'node:http';

export const ParseCookie = (headers: IncomingHttpHeaders): { [cookieName: string]: string } => {
  const cookies = headers?.cookie;
  if (!cookies) return {};

  const returningList: Record<string, string> = {};

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

export const ParseQuery = (query: string): { [queryName: string]: string } => {
  if (!query) return {};

  const returningList: { [queryName: string]: string } = {};

  try {
    const searchParams = new URLSearchParams(query);
    searchParams.forEach((value, key) => {
      returningList[key] = value || 'true';
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
          else returningList[queryPair.split('=')[0]] = 'true';
        } catch (_) {
          returningList[queryPair.split('=')[0]] = queryPair.split('=')[1] || 'true';
        }
      });
  }

  return returningList;
};

export const ParsePath = (path: string | string[]): string[] => {
  if (Array.isArray(path))
    return path
      .map((part) => part.toString().split('/'))
      .flat()
      .filter(Boolean);

  if (typeof path === 'string') return path.split('/').filter(Boolean);

  return path;
};

export const SafeURL = (hrefOrPathname: string | undefined): URL => {
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

export const SafeEscape = (raw: string): string => {
  if (typeof raw !== 'string') return raw;

  return raw
    .replace(/(\/+)/gi, '/')
    .replace(/\.\.%2F/gi, '')
    .replace(/\.\.\//g, '');
};

export const SafeDecode = (raw: string): string => {
  if (typeof raw !== 'string') return raw;

  try {
    const decoded = decodeURIComponent(raw);
    return SafeEscape(decoded);
  } catch (e) {
    return SafeEscape(raw);
  }
};
