const ALLOWED_DOMAINS = [
  'youtube.com',
  'youtu.be',
  'www.youtube.com',
  'spotify.com',
  'open.spotify.com',
  'soundcloud.com',
  'www.soundcloud.com'
];

export const validateAndNormalizeUrl = (urlString: string): string => {
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(urlString);
  } catch (e) {
    throw new Error("Invalid URL format.");
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error("Invalid URL protocol. Only http and https are allowed.");
  }

  if (!ALLOWED_DOMAINS.includes(parsedUrl.hostname)) {
    throw new Error("Domain not allowed. Please provide a link from YouTube, Spotify, or SoundCloud.");
  }

  return parsedUrl.href;
};
