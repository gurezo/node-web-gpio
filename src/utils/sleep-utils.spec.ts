import { describe, expect, it } from 'vitest';
import { sleep } from './sleep-utils';

describe('sleep-utils', () => {
  it('should sleep for the specified time', async () => {
    const start = Date.now();
    await sleep(100);
    const end = Date.now();
    const elapsed = end - start;
    expect(elapsed).toBeGreaterThanOrEqual(100);
  });
});
