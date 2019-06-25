const cosmiconfig = require('cosmiconfig')
const debug = require('debug')('hawkeye:main')
const runAll = require('./runAll')
const { getConfig } = require('./getConfig')
const printErrors = require('./printErrors')

const errConfigNotFound = new Error('Config could not be found')
const SUCCESS = 0
const ERROR = 1

function loadConfig () {
  const explorer = cosmiconfig('hawkeye', {
    searchPlaces: [
      'package.json',
      '.hawkeyerc',
      '.hawkeyerc.json',
      '.hawkeyerc.yaml',
      '.hawkeyerc.yml',
      '.hawkeyerc.js',
      'hawkeye.config.js'
    ]
  })

  return explorer.search()
}

module.exports = function hawkeye (logger = console, debugMode) {
  // load hawkeye config
  debug('Loading config using `cosmiconfig`')

  return loadConfig()
    .then(result => {
      if (result == null) throw errConfigNotFound

      debug('Successfully loaded config from `%s`:\n%O', result.filepath, result.config)
      const config = getConfig(result.config)
      return runAll(config)
        .then(() => {
          // No errors, exiting with 0
          debug('hawkeye were executed successfully!')
          process.exitCode = SUCCESS
        }).catch(err => {
          process.exitCode = ERROR
          // Runtime errors detected, printing and exiting with non-zero
          printErrors(err)
        })
    })
    .catch(err => {
      process.exitCode = ERROR
      // just log custom error message
      if (err === errConfigNotFound) {
        logger.error(`${err.message}.`)
      } else {
        // It was probably a parsing error
        logger.error(`Could not parse hawkeye config. ${err}`)
      }
    })
}
