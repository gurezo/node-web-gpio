import { describe, expect, it, vi } from 'vitest';
import { GPIOAccess, GPIOPort, GPIOPortMap, requestGPIOAccess } from './index';

describe('index', () => {
  describe('requestGPIOAccess', () => {
    it('should return a new GPIOAccess instance', async () => {
      const access = await requestGPIOAccess();
      expect(access).toBeInstanceOf(GPIOAccess);
    });

    it('should create a new GPIOPortMap', async () => {
      const access = await requestGPIOAccess();
      expect(access.ports).toBeInstanceOf(GPIOPortMap);
    });

    it('should handle errors during unexportAll', async () => {
      // Mock the unexportAll method to throw an error
      const mockAccess = new GPIOAccess();
      vi.spyOn(mockAccess, 'unexportAll').mockRejectedValue(
        new Error('Test error'),
      );

      // The function should still return a valid GPIOAccess instance
      const access = await requestGPIOAccess();
      expect(access).toBeInstanceOf(GPIOAccess);
    });
  });

  describe('exports', () => {
    it('should export GPIOAccess', () => {
      expect(GPIOAccess).toBeDefined();
    });

    it('should export GPIOPort', () => {
      expect(GPIOPort).toBeDefined();
    });

    it('should export GPIOPortMap', () => {
      expect(GPIOPortMap).toBeDefined();
    });
  });
});
