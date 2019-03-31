'use strict'

const parse = require('string-argv')
const execa = require('execa')
const symbols = require('log-symbols')

function execLinter (bin, args, fileList) {
  const binArgs = args.concat(fileList)
  return execa(bin, binArgs)
}

const successMsg = linter => `${symbols.success} ${linter} execute success!`

module.exports = function resolveTaskFn ({ linter, fileList }) {
  const [binName, ...args] = parse(linter)
  return (ctx) =>
    execLinter(binName, args, fileList).then(result => successMsg(linter))
      .catch(err => { throw new Error(err) })
}
