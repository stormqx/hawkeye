const isArray = require('lodash/isArray')
const resolveTaskFn = require('./resolveTaskFn')

const debug = require('debug')('hawkeye:make-cmd-tasks')

module.exports = function makeCmdTasks (commands, fileList) {
  debug('Creating listr tasks for commands %o', commands)
  const cmdArray = isArray(commands) ? commands : [commands]
  return cmdArray.map(cmd => ({
    title: cmd,
    task: resolveTaskFn({
      cmd,
      fileList
    })
  }))
}
