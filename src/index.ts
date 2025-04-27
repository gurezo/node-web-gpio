import { GPIOAccess } from './core/gpio-access';
import { GPIOPort } from './core/gpio-port';
import { GPIOPortMap } from './core/gpio-port-map';
import { sleep } from './utils/sleep-utils';

/**
 * GPIOアクセス要求処理
 * @return GPIOアクセス
 */
export async function requestGPIOAccess(): Promise<GPIOAccess> {
  const ports = new GPIOPortMap();
  const access = new GPIOAccess(ports);

  try {
    await access.unexportAll();
    await sleep(100);
  } catch (error) {
    console.error(error);
  }

  return access;
}

export { GPIOAccess, GPIOPort, GPIOPortMap };
