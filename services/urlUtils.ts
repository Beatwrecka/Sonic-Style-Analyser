export const ALLOWED_DOMAINS = [
  'youtube.com',
  'youtu.be',
  'spotify.com',
  'open.spotify.com',
  'soundcloud.com',
  'music.apple.com'
];

export const validateAndNormalizeUrl = (urlString: string): string => {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(urlString);
  } catch (error) {
    throw new Error("Invalid URL format.");
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error("Invalid URL protocol. Only http and https are allowed.");
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  // Check if hostname matches any allowed domain (exact match or subdomain like www.youtube.com)
  const isAllowed = ALLOWED_DOMAINS.some(domain =>
    hostname === domain || hostname.endsWith(`.${domain}`)
  );

  if (!isAllowed) {
    throw new Error("URL domain is not allowed. Only YouTube, Spotify, SoundCloud, and Apple Music are supported.");
  }

  return parsedUrl.href;
};
