const parse = require('string-argv')
const execa = require('execa')
const symbols = require('log-symbols')

function execLinter (bin, args, fileList) {
  const binArgs = args.concat(fileList)
  return execa(bin, binArgs)
}

const successMsg = linter => `${symbols.success} ${linter} execute success!`

module.exports = function resolveTaskFn ({ cmd, fileList }) {
  const [binName, ...args] = parse(cmd)
  return (ctx) =>
    execLinter(binName, args, fileList).then(result => successMsg(cmd))
      .catch(err => { throw err })
}
