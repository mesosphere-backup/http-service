const FINGERPRINT_QUERYPARAMETER = "_ts";
export function fingerprintUrl(
// @ts-ignore typescript-all-in
url) {
  const tsQueryParameter = `${FINGERPRINT_QUERYPARAMETER}=${Date.now()}`;

  if (!/\?/.test(url)) {
    return `${url}?${tsQueryParameter}`;
  }

  if (url.includes(`${FINGERPRINT_QUERYPARAMETER}=`)) {
    return url;
  }

  return `${url}&${tsQueryParameter}`;
}