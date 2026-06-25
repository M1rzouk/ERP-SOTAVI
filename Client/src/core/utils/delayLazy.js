export function delayLazy(importPromise, minDelayMs = 2000) {
  return Promise.all([
    importPromise,
    new Promise(resolve => setTimeout(resolve, minDelayMs))
  ]).then(([moduleExports]) => moduleExports);
}