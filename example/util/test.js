const util = require('util')

const a = util.deprecate(() => {
  console.log('function self')
}, '该方法即将被弃用', 'DEP0001')

a()
