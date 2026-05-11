export const ERROR_INVALID_URL = "Invalid URL format.";
export const ERROR_INVALID_PROTOCOL = "Invalid URL protocol. Only http and https are allowed.";
export const ERROR_UNALLOWED_DOMAIN = "Invalid URL domain. Only YouTube, Spotify, and SoundCloud are allowed.";

const ALLOWED_DOMAINS = [
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'spotify.com',
  'open.spotify.com',
  'soundcloud.com'
];

export function validateAndNormalizeUrl(urlStr: string): string {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(urlStr);
  } catch (error) {
    throw new Error(ERROR_INVALID_URL);
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error(ERROR_INVALID_PROTOCOL);
  }

  const isAllowedDomain = ALLOWED_DOMAINS.some(domain =>
    parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
  );

  if (!isAllowedDomain) {
    throw new Error(ERROR_UNALLOWED_DOMAIN);
  }

  return parsedUrl.href;
}
