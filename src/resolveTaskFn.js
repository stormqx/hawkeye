const parse = require('string-argv')
const execa = require('execa')
const symbols = require('log-symbols')

const debug = require('debug')('hawkeye:task')

function execLinter (bin, args, fileList) {
  // pass fileList to args will cause some exceptions.
  // e.g. { bin: 'npm', args: 'install', fileList: 'package.json'}
  // const binArgs = args.concat(fileList)
  debug('binName:', bin)
  debug('binArgs: %o', args)
  return execa(bin, args)
}

const successMsg = linter => `${symbols.success} ${linter} execute success!`

module.exports = function resolveTaskFn ({ cmd, fileList }) {
  const [binName, ...args] = parse(cmd)
  return (ctx) =>
    execLinter(binName, args, fileList).then(result => successMsg(cmd))
      .catch((err) => { throw new Error(err) })
}
