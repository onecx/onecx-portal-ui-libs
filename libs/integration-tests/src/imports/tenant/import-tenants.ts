import { readdir, readFile } from 'fs/promises'
import path from 'path'
import axios from 'axios'

export async function importTenants(tenantsDir: string, endpoint: string) {
  console.log('##### Importing tenants')
  const files = await readdir(tenantsDir)
  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const data = await readFile(path.join(tenantsDir, file), 'utf-8')
    try {
      const response = await axios.post(endpoint, JSON.parse(data), {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true,
      })
      if ([200, 201].includes(response.status)) {
        console.log(`\x1b[32m Tenants were uploaded with status code ${response.status}\x1b[0m`)
      } else {
        console.log(`\x1b[31m Tenants were uploaded with status code ${response.status}\x1b[0m`)
      }
    } catch (err) {
      console.error(`\x1b[31m Error uploading tenants:`, err, '\x1b[0m')
    }
  }
}
