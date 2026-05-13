import test from 'node:test';
import assert from 'node:assert';
import { validateAndNormalizeUrl } from '../services/urlUtils.ts';

test('validateAndNormalizeUrl - valid domains and protocols', () => {
  const validUrls = [
    'https://youtube.com/watch?v=123',
    'http://www.youtube.com/watch?v=123',
    'https://youtu.be/123',
    'https://spotify.com/track/123',
    'https://open.spotify.com/track/123',
    'https://soundcloud.com/artist/track'
  ];

  for (const url of validUrls) {
    const normalized = validateAndNormalizeUrl(url);
    assert.strictEqual(normalized, url, `Expected ${url} to be valid`);
  }
});

test('validateAndNormalizeUrl - invalid format', () => {
  assert.throws(
    () => validateAndNormalizeUrl('not a url'),
    /Invalid URL format/
  );
});

test('validateAndNormalizeUrl - invalid protocol', () => {
  const invalidProtocolUrls = [
    'ftp://youtube.com/watch?v=123',
    'javascript:alert(1)',
    'data:text/html,<html>',
    'file:///etc/passwd'
  ];

  for (const url of invalidProtocolUrls) {
    assert.throws(
      () => validateAndNormalizeUrl(url),
      /Invalid URL protocol/
    );
  }
});

test('validateAndNormalizeUrl - unauthorized domains', () => {
  const unauthorizedUrls = [
    'https://example.com',
    'https://malicious.com',
    'https://notyoutube.com',
    'https://youtube.malicious.com'
  ];

  for (const url of unauthorizedUrls) {
    assert.throws(
      () => validateAndNormalizeUrl(url),
      /Unauthorized domain/
    );
  }
});
