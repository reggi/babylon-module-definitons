import babylonModuleDefinitions from '../lib/index'
import assert from 'assert'

let code = `
import * as one from 'one'
import "two"
import three from "three"
require('four')
let five = require('five')
`

let file = './test/index.js'

describe('babylonModuleDefinitions lib', () => {
  it('should work passing code', () => {
    let val = babylonModuleDefinitions({code})
    assert.deepEqual(val, ['one', 'two', 'three', 'four', 'five'])
  })
  it('should work passing file', () => {
    return babylonModuleDefinitions({file}).then(val => {
      assert.deepEqual(val, ['../src/index', 'assert'])
    })
  })
})
