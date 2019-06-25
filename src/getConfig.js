const intersection = require('lodash/intersection')
const isObject = require('lodash/isObject')
const defaultsDeep = require('lodash/defaultsDeep')
const debug = require('debug')('hawkeye:cfg')

/**
 * Default config object
 *
 */
const defaultConfig = {
  globOptions: {
    matchBase: true,
    dot: true
  },
  linters: {},
  ignore: [],
  concurrent: true
}

function getConfig (sourceConfig) {
  debug('Normalizing config')
  return defaultsDeep(
    {}, // Do not mutate sourceConfig!!!
    isSimple(sourceConfig) ? { linters: sourceConfig } : sourceConfig,
    defaultConfig
  )
}

function validateConfig (config) {
  debug('validating config')
  // TODO
  return config
}

/**
 * Check if the config is "simple" i.e. doesn't contains any of full config keys
 *
 * @param config
 * @returns {boolean}
 */
function isSimple (config) {
  return (
    isObject(config) &&
      !config.hasOwnProperty('linters') &&
      intersection(Object.keys(defaultConfig), Object.keys(config)).length === 0
  )
}

module.exports = {
  getConfig,
  validateConfig
}
