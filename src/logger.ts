const timestamp = () => new Date().toISOString();

export const logInfo = (message: string, ...rest: unknown[]) => {
  console.info(`[${timestamp()}] ${message}`, ...rest);
};

export const logError = (message: string, ...rest: unknown[]) => {
  console.error(`[${timestamp()}] ${message}`, ...rest);
};
