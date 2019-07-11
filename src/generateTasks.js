const micromatch = require('micromatch')
const path = require('path')
const pathIsInside = require('path-is-inside')
const { getConfig } = require('./getConfig')
const resolveGitDir = require('./resolveGitDir')

const debug = require('debug')('hawkeye:gen-tasks')

module.exports = function generateTasks (config, diffRelFiles) {
  debug('generating hawkeye tasks')
  const normalizedConfig = getConfig(config)
  const { linters, globOptions, ignore } = normalizedConfig
  const gitDir = resolveGitDir()
  debug('gitDir: %s', gitDir)
  const cwd = process.cwd()
  debug('process CWD: %s', cwd)
  // Only worry about children of the CWD
  // Make the paths relative to CWD for filtering
  const diffFiles = diffRelFiles.map(file => path.resolve(gitDir, file))
    .filter(file => pathIsInside(file, cwd))
    .map(file => path.relative(cwd, file))
  debug('diffFiles relative to CWD: \n%O', diffFiles)

  return Object.keys(linters).map(pattern => {
    const commands = linters[pattern]
    const fileList = micromatch(
      diffFiles,
      pattern,
      {
        ...globOptions,
        ignore
      }
    )
    const task = { pattern, commands, fileList }
    debug('hawkeye tasks: \n%O', task)
    return task
  })
}
