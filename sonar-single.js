const { execSync } = require('child_process')
const fs = require('fs')

/**
 * Script to run SonarQube analysis for a single library
 * Usage: npm run sonar -- <library-name>
 */

function runSonarForLib(lib) {
  console.log(`Running sonar scan for library: ${lib}`)

  // Check if library exists
  if (!fs.existsSync(`libs/${lib}`)) {
    console.error(`Error: Library '${lib}' not found in libs/ directory`)
    console.error('Available libraries:')
    const availableLibs = fs.readdirSync('libs').filter((file) => fs.statSync(`libs/${file}`).isDirectory())
    console.error(availableLibs.join(', '))
    process.exit(1)
  }

  execSync(`npx nx run ${lib}:test`, { stdio: 'inherit' })
  execSync('bash normalize-lcov.sh', { stdio: 'inherit' })
  process.chdir(`libs/${lib}`)
  execSync('npx sonarqube-scanner', { stdio: 'inherit' })
  console.log(`Sonar scan completed for library: ${lib}`)
}

// Main logic
if (process.argv.length <= 2) {
  console.error('Error: Library name is required')
  console.error('Usage: npm run sonar -- <library-name>')
  console.error('Example: npm run sonar -- angular-auth')

  // Show available libraries
  if (fs.existsSync('libs')) {
    const availableLibs = fs.readdirSync('libs').filter((file) => fs.statSync(`libs/${file}`).isDirectory())
    console.error('\nAvailable libraries:')
    console.error(availableLibs.join(', '))
  }

  process.exit(1)
}

const lib = process.argv[2]
runSonarForLib(lib)
