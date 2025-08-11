import { readdir, readFile } from 'fs/promises'
import path from 'path'
import axios from 'axios'

export async function importProducts(baseDir: string, endpointBase: string) {
  console.log('##### Importing products for product store')
  const dir = path.join(baseDir, 'products')
  const files = await readdir(dir)
  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const fileName = file.replace('.json', '')
    const data = await readFile(path.join(dir, file), 'utf-8')
    const endpoint = `${endpointBase}/operator/product/v1/update/${fileName}`
    try {
      const response = await axios.put(endpoint, JSON.parse(data), {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true,
      })
      if ([200, 201].includes(response.status)) {
        console.log(`\x1b[32mProduct ${fileName} uploaded with result ${response.status}\x1b[0m`)
      } else {
        console.log(`\x1b[31mProduct ${fileName} uploaded with result ${response.status}\x1b[0m`)
      }
    } catch (err) {
      console.error(`\x1b[31mError uploading product ${fileName}:`, err, '\x1b[0m')
    }
  }
}

export async function importSlots(baseDir: string, endpointBase: string) {
  console.log('##### Importing slots for product store')
  const dir = path.join(baseDir, 'slots')
  const files = await readdir(dir)
  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const fileName = file.replace('.json', '')
    const [product, appid, slot] = fileName.split('_')
    const data = await readFile(path.join(dir, file), 'utf-8')
    const endpoint = `${endpointBase}/operator/slot/v1/${product}/${appid}`
    try {
      const response = await axios.put(endpoint, JSON.parse(data), {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true,
      })
      if ([200, 201].includes(response.status)) {
        console.log(
          `\x1b[32mSlot ${slot} for app ${appid} and product ${product} was uploaded with result ${response.status}\x1b[0m`
        )
      } else {
        console.log(
          `\x1b[31mSlot ${slot} for app ${appid} and product ${product} was uploaded with result ${response.status}\x1b[0m`
        )
      }
    } catch (err) {
      console.error(`\x1b[31mError uploading slot ${slot} for app ${appid} and product ${product}:`, err, '\x1b[0m')
    }
  }
}

export async function importMicroservices(baseDir: string, endpointBase: string) {
  console.log('##### Importing microservices for product store')
  const dir = path.join(baseDir, 'microservices')
  const files = await readdir(dir)
  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const fileName = file.replace('.json', '')
    const [product, appid] = fileName.split('_')
    const data = await readFile(path.join(dir, file), 'utf-8')
    const endpoint = `${endpointBase}/operator/ms/v1/${product}/${appid}`
    try {
      const response = await axios.put(endpoint, JSON.parse(data), {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true,
      })
      if ([200, 201].includes(response.status)) {
        console.log(
          `\x1b[32mMicroservice ${appid} for product ${product} was uploaded with result ${response.status}\x1b[0m`
        )
      } else {
        console.log(
          `\x1b[31mMicroservice ${appid} for product ${product} was uploaded with result ${response.status}\x1b[0m`
        )
      }
    } catch (err) {
      console.error(`\x1b[31mError uploading microservice ${appid} for product ${product}:`, err, '\x1b[0m')
    }
  }
}

export async function importMicrofrontends(baseDir: string, endpointBase: string) {
  console.log('##### Importing microfrontends for product store')
  const dir = path.join(baseDir, 'microfrontends')
  const files = await readdir(dir)
  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const fileName = file.replace('.json', '')
    const [product, appid, mfe] = fileName.split('_')
    const data = await readFile(path.join(dir, file), 'utf-8')
    const mfeData = JSON.parse(data)

    // Dynamically update the remote paths
    const appName = mfeData.appName
    const originalRemoteBaseUrl = mfeData.remoteBaseUrl
    const originalRemoteEntry = mfeData.remoteEntry
    if (appName) {
      mfeData.remoteBaseUrl = `http://${appName}:8080/${originalRemoteBaseUrl}`
      mfeData.remoteEntry = `http://${appName}:8080/${originalRemoteEntry}`
    }

    const endpoint = `${endpointBase}/operator/mfe/v1/${product}/${appid}`
    try {
      const response = await axios.put(endpoint, mfeData, {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true,
      })
      if ([200, 201].includes(response.status)) {
        console.log(
          `\x1b[32mMFE ${mfe} for app ${appid} for product ${product} was uploaded with result ${response.status}\x1b[0m`
        )
      } else {
        console.log(
          `\x1b[31mMFE ${mfe} for app ${appid} for product ${product} was uploaded with result ${response.status}\x1b[0m`
        )
      }
    } catch (err) {
      console.error(`\x1b[31mError uploading MFE ${mfe} for app ${appid} for product ${product}:`, err, '\x1b[0m')
    }
  }
}
