/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const { spawn } = require('child_process')
const packageJSON = require('../package.json')
const { writeFile } = require('fs/promises')

function execCmd (command, strs) {
  return new Promise(resolve => {
    const result = spawn(command, strs)
    result.on('close', () => {
      resolve()
    })
  })
}

(async function () {

  let newVersion = process.argv[2]
  if (['major', 'minor', 'patch'].includes(newVersion)) {
    let [majorV, minorV, patchV] = packageJSON.version.split('.').map(v => +v)
    newVersion === 'major' && (() => {
      majorV = ++majorV
      minorV = 0
      patchV = 0
    })()
    newVersion === 'minor' && (() => {
      minorV = ++minorV
      patchV = 0
    })()
    newVersion === 'patch' && (patchV = ++patchV)
    newVersion = `${majorV}.${minorV}.${patchV}`
  } else if (!/^([1-9]\d|[1-9])(\.([1-9]\d|\d)){2}$/.test(newVersion)) {
    throw new Error(`版本号确实或格式不正确【${newVersion}】`)
  }
  console.log(`change: ${packageJSON.version} -> ${newVersion}`)

  if (newVersion === packageJSON.version) {
    throw new Error(`版本号未变更`)
  }

  packageJSON.version = newVersion
  await writeFile('./package.json', `${JSON.stringify(packageJSON, null, 2)}\n`, { encoding: 'utf-8' })

  // https://stackoverflow.com/questions/43230346/error-spawn-npm-enoent
  await execCmd(/^win/.test(process.platform) ? 'npm.cmd' : 'npm', ['run', 'changelog'])
  await execCmd('git', ['add', '.'])
  await execCmd('git', ['commit', '-m', `chore(version): v${newVersion}`])
  await execCmd('git', ['tag', `v${newVersion}`, 'HEAD'])

})()
