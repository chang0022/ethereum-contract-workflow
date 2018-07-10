const fs = require('fs-extra')
const path = require('path')
const solc = require('solc')

// Cleanup
const compileDir = path.resolve(__dirname, '../compiled')
fs.removeSync(compileDir)
fs.ensureDirSync(compileDir)

// Compile
const contractPath = path.resolve(__dirname, '../contracts', 'Car.sol')
const contractSource = fs.readFileSync(contractPath, 'utf8')
const result = solc.compile(contractSource, 1)

// Check errors
if (Array.isArray(result.errors) && result.errors.length) {
  throw new Error(result.errors[0])
}

// Save to disk
Object.keys(result.contracts).forEach(name => {
  const contractName = name.replace(/^:/, '')
  const filePath = path.resolve(compileDir, `${contractName}.json`)
  fs.outputJsonSync(filePath, result.contracts[name])
  console.log(`save compiled contract ${contractName} to ${filePath}`)
})
