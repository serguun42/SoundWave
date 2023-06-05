export function isCookieExists(name: string) {
  return document.cookie.split(';').filter(cookie => cookie.trim().startsWith(`${name}=`)).length !== 0;
}

export function convertSecondsToString(time: number) {
  const minutes = Math.trunc(time / 60);
  let seconds = Math.round(time % 60).toString();
  if (seconds.length === 1) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}
