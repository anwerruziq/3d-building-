// Browser stub for node:async_hooks — not needed in SPA mode
export class AsyncLocalStorage<T = any> {
  getStore(): T | undefined { return undefined; }
  run<R>(_store: T, fn: (...args: any[]) => R, ...args: any[]): R { return fn(...args); }
  enterWith(_store: T): void {}
  disable(): void {}
}
