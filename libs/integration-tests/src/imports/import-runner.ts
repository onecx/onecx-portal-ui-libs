// import-runner.ts
import { ImportManager } from './import-manager'

async function run() {
  try {
    const importManager = new ImportManager()
    await importManager.import()
    console.log('Import succesfully finished')
  } catch (error) {
    console.error('Error Import:', error)
    process.exit(1)
  }
}

run()
