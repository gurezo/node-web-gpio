import { describe, expect, it } from 'vitest';
import { Uint16Max } from '../constants/gpio-constants';
import { parseUint16 } from './uint16-utils';

describe('uint16-utils', () => {
  it('should parse valid uint16 string', () => {
    expect(parseUint16('0')).toBe(0);
    expect(parseUint16('65535')).toBe(Uint16Max);
    expect(parseUint16('12345')).toBe(12345);
  });

  it('should throw RangeError for invalid uint16 values', () => {
    expect(() => parseUint16('-1')).toThrow(RangeError);
    expect(() => parseUint16('65536')).toThrow(RangeError);
    expect(() => parseUint16('99999')).toThrow(RangeError);
  });

  it('should throw RangeError for non-numeric strings', () => {
    expect(() => parseUint16('abc')).toThrow(RangeError);
    expect(() => parseUint16('')).toThrow(RangeError);
  });
});
