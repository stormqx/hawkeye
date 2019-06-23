// import Listr from 'listr'
const makeConsoleMock = require('consolemock')
const printErrors = require('../src/printErrors')

describe('printErrors', () => {
  const originalConsole = global.console

  beforeAll(() => {
    global.console = makeConsoleMock()
  })

  beforeEach(() => {
    global.console.clearHistory()
  })

  afterAll(() => {
    global.console = originalConsole
  })

  it('should print plain errors', () => {
    const err = new Error('We have a problem')
    printErrors(err)
    expect(console.printHistory()).toMatchSnapshot()
  })
})
