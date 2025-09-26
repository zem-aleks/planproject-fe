export const notReachable = (_: never): never => {
  console.error(_);
  throw new Error(`Not reachable state appeared: ${JSON.stringify(_)}`);
};

export const noOperation = () => {};

export const notReachablePath = (context: string) => {
  console.error(`Not reachable path appeared: ${context}`);
  throw new Error(`Not reachable path appeared: ${context}`);
};

export const notImplemented = (context?: string): never => {
  throw new Error(`Not implemented: ${context}`);
};
