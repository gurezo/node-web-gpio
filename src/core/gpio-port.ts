import { EventEmitter } from 'node:events';
import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import {
  GpioOffset,
  PollingInterval,
  SysfsGPIOPath,
} from '../constants/gpio-constants';
import { InvalidAccessError, OperationError } from '../types/error-types';
import {
  DirectionMode,
  GPIOChangeEvent,
  GPIOChangeEventHandler,
  GPIOPortInterface,
  GPIOValue,
  PinName,
  PortName,
} from '../types/gpio-types';
import { parseUint16 } from '../utils/uint16-utils';

/**
 * GPIO ポート
 */
export class GPIOPort extends EventEmitter implements GPIOPortInterface {
  /** ポート番号 */
  private readonly _portNumber: number;
  /** ポーリング間隔 */
  private readonly _pollingInterval: number;
  /** 入出力方向 */
  private _direction: DirectionMode | OperationError;
  /** エクスポート */
  private _exported: boolean | OperationError;
  /** 入出力値 */
  private _value: GPIOValue | undefined;
  /** タイムアウト値 */
  private _timeout: ReturnType<typeof setInterval> | undefined;
  /** GPIO チェンジイベントハンドラ */
  onchange: GPIOChangeEventHandler | undefined;

  /**
   * Creates an instance of GPIOPort.
   * @param portNumber ポート番号
   */
  constructor(portNumber: number) {
    super();

    this._portNumber = parseUint16(portNumber.toString()) + GpioOffset;
    this._pollingInterval = PollingInterval;
    this._direction = new OperationError('Unknown direction.');
    this._exported = new OperationError('Unknown export.');

    this.on('change', (event: GPIOChangeEvent): void => {
      if (this.onchange !== undefined) this.onchange(event);
    });
  }

  /**
   * ポート番号取得処理
   * @return 現在のポート番号
   */
  get portNumber(): number {
    return this._portNumber;
  }

  /**
   * ポート名取得処理
   * @return 現在のポート名
   */
  get portName(): PortName {
    return `gpio${this.portNumber}`;
  }

  /**
   * ピン名取得処理
   * @return 現在のピン名
   */
  get pinName(): PinName {
    // NOTE: Unknown pinName.
    return '';
  }

  /**
   * GPIO 入出力方向 getter
   * @return 現在のGPIO 入出力方向
   */
  get direction(): DirectionMode {
    if (this._direction instanceof OperationError) throw this._direction;
    return this._direction;
  }

  /**
   * GPIO export の有無 getter
   * @return 現在のGPIO 出力
   */
  get exported(): boolean {
    if (this._exported instanceof OperationError) throw this._exported;
    return this._exported;
  }

  /**
   * GPIO 出力処理
   * @param direction GPIO 入出力方向
   * @return export 処理の完了
   */
  async export(direction: DirectionMode): Promise<void> {
    if (!/^(in|out)$/.test(direction)) {
      throw new InvalidAccessError(`Must be "in" or "out".`);
    }

    try {
      await fs.access(path.join(SysfsGPIOPath, this.portName));
      this._exported = true;
    } catch {
      this._exported = false;
    }

    try {
      clearInterval(this._timeout as ReturnType<typeof setInterval>);
      if (!this.exported) {
        await fs.writeFile(
          path.join(SysfsGPIOPath, 'export'),
          String(this.portNumber),
        );
      }
      await fs.writeFile(
        path.join(SysfsGPIOPath, this.portName, 'direction'),
        direction,
      );
      if (direction === 'in') {
        this._timeout = setInterval(
          this.read.bind(this),
          this._pollingInterval,
        );
      }
      this._direction = direction;
      this._exported = true;
    } catch (error) {
      this._exported = false;
      throw error;
    }
  }

  /**
   * GPIO ポート開放処理
   * @return unexport 処理の完了
   */
  async unexport(): Promise<void> {
    try {
      clearInterval(this._timeout as ReturnType<typeof setInterval>);
      if (this.exported) {
        await fs.writeFile(
          path.join(SysfsGPIOPath, 'unexport'),
          String(this.portNumber),
        );
      }
      this._exported = false;
    } catch (error) {
      this._exported = true;
      throw error;
    }
  }

  /**
   * GPIO 入力処理
   * @return 入力値
   */
  async read(): Promise<GPIOValue> {
    if (!this.exported) {
      throw new InvalidAccessError('GPIO port is not exported.');
    }
    if (this.direction !== 'in') {
      throw new InvalidAccessError('GPIO port is not input mode.');
    }

    try {
      const value = await fs.readFile(
        path.join(SysfsGPIOPath, this.portName, 'value'),
        'utf8',
      );
      const newValue = Number.parseInt(value.trim(), 10) as GPIOValue;
      if (this._value !== newValue) {
        this._value = newValue;
        this.emit('change', { value: newValue, port: this });
      }
      return newValue;
    } catch (error) {
      throw new OperationError('Failed to read GPIO value.');
    }
  }

  /**
   * GPIO 出力処理
   * @param value 出力値
   * @return 出力処理の完了
   */
  async write(value: GPIOValue): Promise<void> {
    if (!this.exported) {
      throw new InvalidAccessError('GPIO port is not exported.');
    }
    if (this.direction !== 'out') {
      throw new InvalidAccessError('GPIO port is not output mode.');
    }

    try {
      await fs.writeFile(
        path.join(SysfsGPIOPath, this.portName, 'value'),
        String(value),
      );
      if (this._value !== value) {
        this._value = value;
        this.emit('change', { value, port: this });
      }
    } catch (error) {
      throw new OperationError('Failed to write GPIO value.');
    }
  }
}
