/** ポート番号 */
export type PortNumber = number;
/** ポート名 */
export type PortName = string;
/** ピン名 */
export type PinName = string;

/** 入出力方向 */
export type DirectionMode = 'in' | 'out';

/** GPIO 値 0: LOW / 1: HIGH */
export type GPIOValue = 0 | 1;

/**
 * GPIO ポート
 */
export interface GPIOPortInterface {
  portNumber: number;
  portName: PortName;
  pinName: PinName;
  direction: DirectionMode;
  exported: boolean;
  onchange?: GPIOChangeEventHandler;
  emit(event: 'change', data: GPIOChangeEvent): boolean;
  on(event: 'change', listener: GPIOChangeEventHandler): this;
  unexport(): Promise<void>;
}

/**
 * GPIO チェンジイベント
 */
export interface GPIOChangeEvent {
  /** 入出力値 */
  readonly value: GPIOValue;
  /** ポート */
  readonly port: GPIOPortInterface;
}

/**
 * GPIO チェンジイベントハンドラ
 */
export interface GPIOChangeEventHandler {
  /** イベント */
  (event: GPIOChangeEvent): void;
}
