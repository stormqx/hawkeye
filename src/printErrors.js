'use strict'

const errMsg = err => (err.privateMsg != null ? err.privateMsg : err.message)

module.exports = function printErrors (errorInstance) {
  if (Array.isArray(errorInstance.errors)) {
    errorInstance.errors.forEach(lintError => {
      console.error(errMsg(lintError))
    })
  } else {
    console.error(errMsg(errorInstance))
  }
}
