export function isCookieExists(name: string) {
  return document.cookie.split(';').filter(cookie => cookie.trim().startsWith(`${name}=`)).length !== 0;
}

export function convertSecondsToString(time: number) {
  const roundedTime = Math.round(time);
  const minutes = Math.trunc(roundedTime / 60);
  let seconds = Math.round(roundedTime % 60).toString();
  if (seconds.length === 1) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}
