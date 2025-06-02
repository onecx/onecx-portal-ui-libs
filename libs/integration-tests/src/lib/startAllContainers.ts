import { TestEnvironmentFactory } from './environment/TestEnvironmentFactory'

async function main() {
  const factory = new TestEnvironmentFactory()
  await factory.start()

  console.log('✅ Testumgebung läuft. Drücke Strg+C zum Beenden.')

  // Halte das Skript am Leben
  process.stdin.resume()
}

main().catch((err) => {
  console.error('❌ Fehler beim Starten der Umgebung:', err)
  process.exit(1)
})
