import { readdir, readFile } from 'fs/promises'
import path from 'path'
import axios from 'axios'

export async function importThemes(
  themesDir: string,
  getTokenForTenant: (tenant: string) => Promise<string>,
  endpoint: string
) {
  console.log('##### Importing themes')
  const files = await readdir(themesDir)
  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const [tenant, theme] = file.replace('.json', '').split('_')
    const token = await getTokenForTenant(tenant)
    const data = await readFile(path.join(themesDir, file), 'utf-8')
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
          `\x1b[32mTheme ${theme} were uploaded for tenant ${tenant} with status code ${response.status}\x1b[0m`
        )
      } else {
        console.log(
          `\x1b[31mTheme ${theme} were uploaded for tenant ${tenant} with status code ${response.status}\x1b[0m`
        )
      }
    } catch (err) {
      console.error(`\x1b[31mError uploading theme ${theme} for tenant ${tenant}:`, err, '\x1b[0m')
    }
  }
}
