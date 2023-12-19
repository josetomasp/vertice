export function isSSOUser(): boolean {
  return document.cookie && document.cookie.indexOf('ArrivedViaSSO=true') >= 0;
}
