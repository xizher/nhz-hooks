/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const { spawn } = require('child_process')
const packageJSON = require('../package.json')
const { arr } = require('../array/index.cjs')

function execCmd (command, strs) {
  return new Promise(resolve => {
    const result = spawn(command, strs)
    const msgs = []
    result.stdout.on('data', (data) => {
      msgs.push(`${data}`.replace('\n', ''))
    })
    result.on('close', () => {
      resolve(msgs)
    })
  })
}

(async function () {

  packageJSON['devDependencies'] && Object.entries(packageJSON['devDependencies']).forEach(async ([package, version]) => {
    const msgs = await execCmd(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['view', package, 'version'])
    const msg = arr(msgs).last
    if (!version.includes(msg)) {
      console.log(`${package}: \t ${version} -> ${msg}`)
    }
  })

  // const result = await execCmd(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['view', 'vue', 'version'])
  // const msg = arr(result).last
  // console.log(msg, result)
  

})()
