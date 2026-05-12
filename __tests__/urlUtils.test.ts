import { describe, it } from 'node:test';
import assert from 'node:assert';
import { validateAndNormalizeUrl } from '../services/urlUtils.ts';

describe('validateAndNormalizeUrl', () => {
  it('should accept valid allowed domains', () => {
    assert.strictEqual(
      validateAndNormalizeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    );
    assert.strictEqual(
      validateAndNormalizeUrl('https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl'),
      'https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl'
    );
  });

  it('should reject invalid domains', () => {
    assert.throws(
      () => validateAndNormalizeUrl('https://malicious.com/song'),
      { message: "URL domain is not allowed. Only YouTube, Spotify, SoundCloud, and Apple Music are supported." }
    );
  });

  it('should reject invalid protocols', () => {
    assert.throws(
      () => validateAndNormalizeUrl('ftp://www.youtube.com/watch'),
      { message: "Invalid URL protocol. Only http and https are allowed." }
    );
  });

  it('should reject malformed URLs', () => {
    assert.throws(
      () => validateAndNormalizeUrl('not a url'),
      { message: "Invalid URL format." }
    );
  });
});
