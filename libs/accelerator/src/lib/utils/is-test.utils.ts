/**
 * Utility function to determine if the code is running in a test environment.
 * It checks for the presence of Jasmine or Jest environment variables.
 *
 * @returns {boolean} - Returns true if running in a test environment, otherwise false.
 */
export function isTest(): boolean {
  if(typeof (globalThis as any).jasmine !== 'undefined') {
    return true;
  }
  if(typeof process !== 'undefined' && process.env?.["JEST_WORKER_ID"] !== undefined) {
    return true;
  }
  return false;
}