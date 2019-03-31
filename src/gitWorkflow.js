'use strict'

const path = require('path')
const execa = require('execa')
const resolveGitDir = require('./resolveGitDir')

function getAbsolutePath (dir) {
  return path.isAbsolute(dir) ? dir : path.resolve(dir)
}

async function execGit (cmd, options) {
  const cwd = options && options.cwd ? options.cwd : resolveGitDir()
  //   debug('Running git command', cmd)
  try {
    const { stdout } = await execa('git', [].concat(cmd), {
      ...options,
      cwd: getAbsolutePath(cwd)
    })
    return stdout
  } catch (err) {
    throw new Error(err)
  }
}

async function getDiffForTrees (tree1 = 'ORIG_HEAD', tree2 = 'HEAD', options) {
//   debug(`Generating diff between trees ${tree1} and ${tree2}...`)
  return execGit(
    [
      'diff-tree',
      '-r',
      '--name-only',
      '--no-commit-id',
      tree1,
      tree2
    ],
    options
  )
}

module.exports = {
  execGit,
  getDiffForTrees
}
