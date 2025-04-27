import { describe, expect, it } from 'vitest';
import { GPIOPort } from './gpio-port';
import { GPIOPortMap } from './gpio-port-map';

describe('GPIOPortMap', () => {
  it('should extend Map class', () => {
    const map = new GPIOPortMap();
    expect(map).toBeInstanceOf(Map);
  });

  it('should store and retrieve GPIOPort instances', () => {
    const map = new GPIOPortMap();
    const port = new GPIOPort(1);
    map.set(1, port);
    expect(map.get(1)).toBe(port);
  });
});
