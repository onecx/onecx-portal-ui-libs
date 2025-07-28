import { readdir, readFile } from 'fs/promises'
import path from 'path'
import axios from 'axios'

export async function importAssignments(
  assignmentsDir: string,
  getTokenForTenant: (tenant: string) => Promise<string>,
  endpoint: string
) {
  console.log('##### Importing assignments')
  const files = await readdir(assignmentsDir)
  for (const file of files) {
    if (!file.endsWith('.json')) continue

    const fileNameWithoutExt = file.replace(/\.json$/, '')
    let tenant: string
    let product: string

    if (fileNameWithoutExt.includes('_')) {
      const parts = fileNameWithoutExt.split('_')
      tenant = parts[0]
      product = parts[1] || parts[0]
    } else {
      tenant = fileNameWithoutExt
      product = fileNameWithoutExt
    }

    const token = await getTokenForTenant(tenant)
    const data = await readFile(path.join(assignmentsDir, file), 'utf-8')

    try {
      const response = await axios.post(endpoint, JSON.parse(data), {
        headers: {
          'apm-principal-token': token,
          'Content-Type': 'application/json',
        },
        validateStatus: () => true, // accept all status codes
      })
      if ([200, 201].includes(response.status)) {
        console.log(
          `\x1b[32mAssignments uploaded for product ${product} were uploaded with status code ${response.status}\x1b[0m`
        )
      } else {
        console.log(
          `\x1b[31mAssignments uploaded for product ${product} were uploaded with status code ${response.status}\x1b[0m`
        )
      }
    } catch (err) {
      console.error(`\x1b[31mError uploading assignments for product ${product}:`, err, '\x1b[0m')
    }
  }
}
