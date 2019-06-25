#!/usr/bin/env node

const pkg = require('./package.json')
const cmd = require('commander')
const debugLib = require('debug')
const debug = debugLib('hawkeye:bin')
require('please-upgrade-node')(
  Object.assign({}, pkg, {
    engines: {
      node: '>=8.6.0'
    }
  })
)

cmd
  .version(pkg.version)
  .option('-d, --debug', 'Enable debug mode')
  .parse(process.argv)

if (cmd.debug) {
  debugLib.enable('hawkeye*')
}

debug('Running `hawkeye@%s`', pkg.version)

require('./src')(console, cmd.debug)
