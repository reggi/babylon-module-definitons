# babylonModuleDefinitions

```
npm i babylon-module-definitons --save
```

## Why

Needed way of getting deps from a file with the babel syntax. [Specifically because acorn does not support async / await.](https://github.com/megawac/acorn-umd/issues/60)

## Usage

Pass in `code` (sync):

```js
let code = `
import * as one from 'one'
import "two"
import three from "three"
require('four')
let five = require('five')
`

let val = babylonModuleDefinitions({code})
assert.deepEqual(val, ['one', 'two', 'three', 'four', 'five'])
```

Pass in `file` (async - returns promise):

```js
let file = './test/index.js'
babylonModuleDefinitions({file}).then(val => {
  assert.deepEqual(val, ['../src/index', 'assert'])
})
```
