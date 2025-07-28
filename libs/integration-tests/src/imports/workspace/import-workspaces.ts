import { readdir, readFile } from 'fs/promises'
import path from 'path'
import axios from 'axios'

export async function importWorkspaces(
  workspacesDir: string,
  getTokenForTenant: (tenant: string) => Promise<string>,
  endpoint: string
) {
  console.log('##### Importing workspaces')
  const files = await readdir(workspacesDir)
  for (const file of files) {
    if (!file.endsWith('.json') || !file.includes('_')) continue
    const [tenant, workspace] = file.replace('.json', '').split('_')
    const token = await getTokenForTenant(tenant)
    const data = await readFile(path.join(workspacesDir, file), 'utf-8')
    try {
      const response = await axios.post(endpoint, JSON.parse(data), {
        headers: {
          'apm-principal-token': token,
          'Content-Type': 'application/json',
        },
        validateStatus: () => true,
      })
      if ([200, 201].includes(response.status)) {
        console.log(
          `\x1b[32mUploaded workspace ${workspace} for tenant ${tenant} with status code ${response.status}\x1b[0m`
        )
      } else {
        console.log(
          `\x1b[31mUploaded workspace ${workspace} for tenant ${tenant} with status code ${response.status}\x1b[0m`
        )
      }
    } catch (err) {
      console.error(`\x1b[31mError uploading workspace ${workspace} for tenant ${tenant}:`, err, '\x1b[0m')
    }
  }
}
