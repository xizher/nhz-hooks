
const { spawn } = require('child_process')
const { readdir, stat } = require('fs/promises')

function execCmd (command, strs) {
  return new Promise(resolve => {
    const result = spawn(command, strs)
    result.on('close', () => {
      resolve()
    })
  })
}

;(async function () {
  const names = await readdir('src')
  names.forEach(async name => {
    const path = `src/${name}`
    const isDir = (await stat(path)).isDirectory()
    if (isDir) {
      await execCmd(/^win/.test(process.platform) ? 'npx.cmd' : 'npx', ['typedoc', '--out', `src/${name}`, `src/${name}/index.ts`, '--cleanOutputDir', 'false', '--githubPages', 'false', '--readme', 'none', '--name', name])
    }
  })
})()

// npx typedoc --out src/is src/is/is.ts --cleanOutputDir false --githubPages false --readme none --name is
