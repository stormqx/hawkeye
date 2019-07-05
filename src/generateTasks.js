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
  debug('process cwd: %s', cwd)
  const diffFiles = diffRelFiles.map(file => path.resolve(gitDir, file))
  debug('diffFiles: \n%O', diffFiles)

  return Object.keys(linters).map(pattern => {
    const commands = linters[pattern]
    const isParentDirPattern = pattern.startsWith('../')

    const fileList = micromatch(
      diffFiles
        // Only worry about children of the CWD unless the pattern explicitly
        // specifies that it concerns a parent directory.
        .filter(file => isParentDirPattern || pathIsInside(file, cwd))
        // Make the paths relative to CWD for filtering
        .map(file => path.relative(cwd, file)),
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
