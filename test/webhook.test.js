import test from 'node:test';
import assert from 'node:assert/strict';

import handler, { config } from '../api/webhook.js';

test('handler exports a function', () => {
  assert.equal(typeof handler, 'function');
});

test('config requests nodejs runtime', () => {
  assert.deepEqual(config, { runtime: 'nodejs' });
});
