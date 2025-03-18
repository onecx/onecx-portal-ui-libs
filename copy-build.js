const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Define the path to the .copy-build-to file
const copyBuildToFile = path.join(__dirname, '.copy-build-to')

// Check if the .copy-build-to file exists
if (!fs.existsSync(copyBuildToFile)) {
  // Create the .copy-build-to file with instructions
  fs.writeFileSync(
    copyBuildToFile,
    'Enter the paths where you want to copy the compiled output, each on a new line.\nExample:\n/path/to/destination1/node_modules/@onecx\n/path/to/destination2/node_modules/@onecx\n'
  )
  console.log(
    '.copy-build-to file created. Please add the paths where you want to copy the compiled output, each on a new line.'
  )
  process.exit(0)
}

// Read the paths from the .copy-build-to file
const paths = fs.readFileSync(copyBuildToFile, 'utf-8').split('\n').filter(Boolean)

// Define the source directory
const sourceDir = path.join(__dirname, 'dist')

// Copy the compiled output to each path
paths.forEach((destination) => {
  const destDir = path.resolve(destination)
  execSync(`cp -r ${sourceDir}/libs/* ${destDir}`, { stdio: 'inherit' })
  console.log(`Copied compiled output to ${destDir}`)
})
