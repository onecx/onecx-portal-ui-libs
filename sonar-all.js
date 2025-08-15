const { execSync } = require('child_process')
const fs = require('fs')

/**
 * Script to run SonarQube analysis for all libraries
 * Usage: npm sonar:all
 */

function runSonarForAll() {
  console.log('Running sonar scan for all libraries')
  console.log('Running tests for all libraries...')
  execSync('npx nx run-many -t test', { stdio: 'inherit' })
  execSync('bash normalize-lcov.sh', { stdio: 'inherit' })

  // Get all directories from reports folder
  if (!fs.existsSync('reports')) {
    console.error('Error: Reports folder not found. Make sure tests have been run first.')
    process.exit(1)
  }

  const reportDirs = fs.readdirSync('reports').filter((file) => fs.statSync(`reports/${file}`).isDirectory())

  if (reportDirs.length === 0) {
    console.log('No libraries found in reports folder. No sonar scans to run.')
    return
  }

  console.log(`Found ${reportDirs.length} libraries to scan: ${reportDirs.join(', ')}`)

  // Run sonar for each directory
  for (const dir of reportDirs) {
    console.log(`Running sonar scan for library: ${dir}`)

    if (!fs.existsSync(`libs/${dir}`)) {
      console.warn(`Warning: Library directory 'libs/${dir}' not found. Skipping.`)
      continue
    }

    process.chdir(`libs/${dir}`)
    execSync('npx sonarqube-scanner', { stdio: 'inherit' })
  }

  console.log('Sonar scan completed for all libraries')
}

// Main logic
runSonarForAll()
