import { GPIOPortInterface, PortNumber } from '../types/gpio-types';

/**
 * Different from Web GPIO API specification.
 */
export class GPIOPortMap extends Map<PortNumber, GPIOPortInterface> {}
