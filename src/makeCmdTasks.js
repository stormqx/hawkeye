'use strict'

const isArray = require('lodash/isArray')
const resolveTaskFn = require('./resolveTaskFn')

module.exports = function makeCmdTasks (commands, fileList) {
  // debug('Creating listr tasks for commands %o', commands)
  const lintersArray = isArray(commands) ? commands : [commands]
  return lintersArray.map(linter => ({
    title: linter,
    task: resolveTaskFn({
      linter,
      fileList
    })
  }))
}
