import { describe, expect, it, vi } from 'vitest';
import { GPIOChangeEvent } from '../types/gpio-types';
import { GPIOAccess } from './gpio-access';
import { GPIOPort } from './gpio-port';
import { GPIOPortMap } from './gpio-port-map';

describe('GPIOAccess', () => {
  it('should create an instance with empty port map by default', () => {
    const access = new GPIOAccess();
    expect(access.ports).toBeInstanceOf(GPIOPortMap);
    expect(access.ports.size).toBe(0);
  });

  it('should create an instance with provided port map', () => {
    const portMap = new GPIOPortMap();
    const port = new GPIOPort(1);
    portMap.set(1, port);
    const access = new GPIOAccess(portMap);
    expect(access.ports).toBe(portMap);
    expect(access.ports.get(1)).toBe(port);
  });

  it('should emit change events from ports', () => {
    const portMap = new GPIOPortMap();
    const port = new GPIOPort(1);
    portMap.set(1, port);
    const access = new GPIOAccess(portMap);
    const mockHandler = vi.fn();
    access.on('change', mockHandler);

    const event: GPIOChangeEvent = {
      value: 1,
      port: port,
    };
    port.emit('change', event);

    expect(mockHandler).toHaveBeenCalledWith(event);
  });

  it('should call onchange handler when change event is emitted', () => {
    const access = new GPIOAccess();
    const mockHandler = vi.fn();
    access.onchange = mockHandler;

    const port = new GPIOPort(1);
    const event: GPIOChangeEvent = {
      value: 1,
      port: port,
    };
    access.emit('change', event);

    expect(mockHandler).toHaveBeenCalledWith(event);
  });
});
