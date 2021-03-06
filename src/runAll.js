const Listr = require('listr')
const git = require('./gitWorkflow')
const makeCmdTasks = require('./makeCmdTasks')
const generateTasks = require('./generateTasks')

const debug = require('debug')('hawkeye:runtime')

module.exports = function runAll (config) {
  debug('Running all hawkeye scripts')
  // Config validation
  if (!config) {
    throw new Error('Invalid config provided to runAll! Use getConfig instead.')
  }

  const { concurrent } = config

  return git.getDiffForTrees().then(files => {
    /* filenames is a string filepath array */
    const filenames = files.split('\n')
    debug('Loaded list of diff files in git:\n%O', filenames)
    // hawkeye task
    const tasks = generateTasks(config, filenames).map(task => ({
      title: `Running tasks for ${task.pattern}`,
      task: () =>
        new Listr(
          makeCmdTasks(task.commands, task.fileList),
          {
            // In sub-tasks we don't want to run concurrently
            // and we want to abort on errors
            dateFormat: false,
            concurrent: false,
            exitOnError: true
          }
        ),
      skip: () => {
        if (task.fileList.length === 0) {
          return `No diff files match ${task.pattern}`
        }
        return false
      }
    }))

    // If all of the configured "hawkeye" should be skipped
    // avoid executing any logic
    if (tasks.every(task => task.skip())) {
      console.log('No diff files match any of provided globs.')
      return 'No tasks to run.'
    }

    // Do not terminate main Listr process on SIGINT
    process.on('SIGINT', () => {})

    return new Listr([
      {
        title: 'Running hawkeye...',
        task: () =>
          new Listr(tasks, {
            concurrent,
            exitOnError: !concurrent // Wait for all errors when running concurrently
          })
      }
    ]).run()
  })
}
