import test from 'node:test';
import assert from 'node:assert';
import {
  validateAndNormalizeUrl,
  ERROR_INVALID_URL,
  ERROR_INVALID_PROTOCOL,
  ERROR_UNALLOWED_DOMAIN
} from '../services/urlUtils.ts';

test('validateAndNormalizeUrl', async (t) => {
  await t.test('accepts valid YouTube URL and returns href', () => {
    const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    assert.strictEqual(validateAndNormalizeUrl(url), url);
  });

  await t.test('accepts valid Spotify URL and returns href', () => {
    const url = 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT';
    assert.strictEqual(validateAndNormalizeUrl(url), url);
  });

  await t.test('accepts valid SoundCloud URL and returns href', () => {
    const url = 'https://soundcloud.com/artist/track';
    assert.strictEqual(validateAndNormalizeUrl(url), url);
  });

  await t.test('throws on invalid URL format', () => {
    assert.throws(
      () => validateAndNormalizeUrl('not-a-url'),
      new Error(ERROR_INVALID_URL)
    );
  });

  await t.test('throws on non-HTTP/HTTPS protocol', () => {
    assert.throws(
      () => validateAndNormalizeUrl('javascript:alert(1)'),
      new Error(ERROR_INVALID_PROTOCOL)
    );
    assert.throws(
      () => validateAndNormalizeUrl('file:///etc/passwd'),
      new Error(ERROR_INVALID_PROTOCOL)
    );
    assert.throws(
      () => validateAndNormalizeUrl('data:text/html,<html></html>'),
      new Error(ERROR_INVALID_PROTOCOL)
    );
  });

  await t.test('throws on unallowed domain', () => {
    assert.throws(
      () => validateAndNormalizeUrl('https://www.example.com'),
      new Error(ERROR_UNALLOWED_DOMAIN)
    );
    assert.throws(
      () => validateAndNormalizeUrl('https://malicious-site.com/youtube.com'),
      new Error(ERROR_UNALLOWED_DOMAIN)
    );
  });
});
