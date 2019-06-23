'use strict'

const cosmiconfig = require('cosmiconfig')
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

module.exports = function hawkeye (logger = console) {
  // load hawkeye config
  return loadConfig()
    .then(result => {
      if (result == null) throw errConfigNotFound

      const config = getConfig(result.config)
      return runAll(config)
        .then(() => {
          // No errors, exiting with 0
          process.exitCode = SUCCESS
        }).catch(err => {
          process.exitCode = ERROR
          // Runtime errors detected, printing and exiting with non-zero
          printErrors(err)
        })
    })
    .catch(err => {
      process.exitCode = ERROR
      if (err === errConfigNotFound) {
        logger.error(`${err.message}.`)
      } else {
        // It was probably a parsing error
        logger.error(`Could not parse hawkeye config. ${err}`)
      }
    })
}
