import { CoreBuilder } from './environment/core-builder'

async function main() {
  const factory = new CoreBuilder()
  await factory.startCore()

  console.log('CoreBuilder is running. Press Strg+C for exit.')

  process.stdin.resume()
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
