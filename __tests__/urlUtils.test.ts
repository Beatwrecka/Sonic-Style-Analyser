import { test } from 'node:test';
import * as assert from 'node:assert';
import { validateAndNormalizeUrl } from '../services/urlUtils.ts';

test('validates and normalizes allowed domains', () => {
  const allowedUrls = [
    'https://youtube.com/watch?v=123',
    'http://youtu.be/123',
    'https://www.youtube.com/watch?v=123',
    'https://spotify.com/track/123',
    'https://open.spotify.com/track/123',
    'https://soundcloud.com/artist/track',
    'https://www.soundcloud.com/artist/track'
  ];

  for (const url of allowedUrls) {
    const normalized = validateAndNormalizeUrl(url);
    assert.strictEqual(normalized, url);
  }
});

test('rejects unlisted domains', () => {
  const unlistedUrls = [
    'https://google.com',
    'https://malicious.com',
    'https://example.com'
  ];

  for (const url of unlistedUrls) {
    assert.throws(() => validateAndNormalizeUrl(url), /Domain not allowed/);
  }
});

test('rejects invalid protocols', () => {
  const invalidProtocolUrls = [
    'javascript:alert(1)',
    'file:///etc/passwd',
    'data:text/html,<h1>Hello</h1>'
  ];

  for (const url of invalidProtocolUrls) {
    assert.throws(() => validateAndNormalizeUrl(url), /Invalid URL protocol/);
  }
});

test('rejects invalid URL format', () => {
  assert.throws(() => validateAndNormalizeUrl('not a url'), /Invalid URL format/);
});
