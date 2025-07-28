import { readdir, readFile } from 'fs/promises'
import path from 'path'
import axios from 'axios'

export async function importPermissions(permissionsDir: string, endpointBase: string) {
  console.log('##### Importing permissions')
  const files = await readdir(permissionsDir)
  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const fileName = file.replace('.json', '')
    const [product, appid] = fileName.split('_')
    const data = await readFile(path.join(permissionsDir, file), 'utf-8')
    const endpoint = `${endpointBase}/operator/v1/${product}/${appid}`
    try {
      const response = await axios.put(endpoint, JSON.parse(data), {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true,
      })
      if ([200, 201].includes(response.status)) {
        console.log(
          `\x1b[32mPermissions for app ${appid} and product ${product} was uploaded with result ${response.status}\x1b[0m`
        )
      } else {
        console.log(
          `\x1b[31mPermissions for app ${appid} and product ${product} was uploaded with result ${response.status}\x1b[0m`
        )
      }
    } catch (err) {
      console.error(`\x1b[31mError uploading permissions for app ${appid} and product ${product}:`, err, '\x1b[0m')
    }
  }
}
