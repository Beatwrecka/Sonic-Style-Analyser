export const validateAndNormalizeUrl = (urlString: string): string => {
  // 0. Length validation (DoS mitigation)
  if (urlString.length > 2048) {
    throw new Error("URL exceeds maximum allowed length of 2048 characters.");
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(urlString);
  } catch (error) {
    throw new Error("Invalid URL format.");
  }

  // 1. Protocol validation
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error("Invalid URL protocol. Only http and https are allowed.");
  }

  // 2. Domain Allowlist validation
  // Prevent SSRF and Prompt Injection by restricting the domains allowed for analysis.
  const allowedDomains = [
    'youtube.com',
    'www.youtube.com',
    'youtu.be',
    'spotify.com',
    'open.spotify.com',
    'soundcloud.com',
    'www.soundcloud.com'
  ];

  if (!allowedDomains.includes(parsedUrl.hostname.toLowerCase())) {
    throw new Error(`Unauthorized domain. Allowed domains are: YouTube, Spotify, SoundCloud.`);
  }

  // Return normalized full URL
  return parsedUrl.href;
};
