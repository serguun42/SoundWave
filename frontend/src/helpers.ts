export function isCookieExists(name: string) {
  return document.cookie.split(';').filter(cookie => cookie.trim().startsWith(`${name}=`)).length !== 0;
}
