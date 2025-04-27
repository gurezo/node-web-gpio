import { describe, expect, it } from 'vitest';
import {
  GpioOffset,
  GPIOPortMapSizeMax,
  PollingInterval,
  SysfsGPIOPath,
  Uint16Max,
} from './gpio-constants';

describe('gpio-constants', () => {
  it('should have correct constant values', () => {
    expect(PollingInterval).toBe(100);
    expect(SysfsGPIOPath).toBe('/sys/class/gpio');
    expect(GPIOPortMapSizeMax).toBe(1024);
    expect(Uint16Max).toBe(65535);
  });

  it('should have correct GpioOffset value based on platform', () => {
    // Note: This test assumes the test environment is not running on Linux 6.6 or later
    // In a real environment, you might want to mock os.release() to test both cases
    expect(GpioOffset).toBe(0);
  });
});
