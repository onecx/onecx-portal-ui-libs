const { execSync } = require('child_process')
const fs = require('fs')

// Function for single library
// npm run sonar -- LIB
function runSonarForLib(lib) {
  console.log(`Running sonar scan for ${lib}`)
  execSync(`npx nx run-many -t test -p ${lib}`, { stdio: 'inherit' })
  execSync('bash normalize-lcov.sh', { stdio: 'inherit' })
  process.chdir(`libs/${lib}`)
  execSync('npx sonarqube-scanner', { stdio: 'inherit' })
  process.chdir('../../')
}

// Function for all libraries
// npm run sonar:all
function runSonarForAll() {
  console.log('Running tests for all libraries')
  execSync('npx nx run-many -t test', { stdio: 'inherit' })
  execSync('bash normalize-lcov.sh', { stdio: 'inherit' })

  // Get all directories from reports folder
  const reportDirs = fs.readdirSync('reports').filter((file) => fs.statSync(`reports/${file}`).isDirectory())

  console.log(`Found ${reportDirs.length} libraries to scan: ${reportDirs.join(', ')}`)

  // Run sonar for each directory
  for (const dir of reportDirs) {
    console.log(`Running sonar scan for ${dir}`)
    process.chdir(`libs/${dir}`)
    execSync('npx sonarqube-scanner', { stdio: 'inherit' })
    process.chdir('../../')
  }
}

// Main logic
if (process.argv.length > 2) {
  // If an argument was passed, run sonar for this library
  const lib = process.argv[2]
  runSonarForLib(lib)
} else {
  // If no argument was passed, run sonar for all libraries
  runSonarForAll()
}
