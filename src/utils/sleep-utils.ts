/**
 * スリープ処理
 * @param ms スリープ時間(ミリ秒)
 * @return スリープ完了
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
