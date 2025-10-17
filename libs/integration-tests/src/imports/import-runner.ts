import { ImportManager } from './import-manager'

/**
 * Main entry point for running the OneCX data import process
 *
 * This script initializes the ImportManager and executes the complete import workflow.
 * It handles errors gracefully and exits with appropriate status codes.
 *
 * @example
 * ```bash
 * node import-runner.js
 * ```
 *
 * @remarks
 * - Expects container-info.json to be available in the working directory
 * - Exits with code 1 on any import failures
 * - Uses structured logging throughout the import process
 */
async function run() {
  try {
    const importManager = new ImportManager('./container-info.json')
    await importManager.import()
  } catch (error) {
    console.error('Error Import:', error)
    process.exit(1)
  }
}

run()
