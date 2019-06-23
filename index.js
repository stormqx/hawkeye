#!/usr/bin/env node

const pkg = require('./package.json')
require('please-upgrade-node')(
  Object.assign({}, pkg, {
    engines: {
      node: '>=8.6.0'
    }
  })
)

require('./src')()
