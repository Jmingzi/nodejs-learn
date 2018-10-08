const assert = require('assert').strict

// console.log(assert)
// assert.deepStrictEqual(NaN, NaN)
// assert.deepStrictEqual(+0, -0)

const pro = {a: 1}
const obj1 = Object.create(pro)
const obj2 = Object.create(pro)

// assert.deepStrictEqual(obj1, obj2)
// assert.strictEqual(obj1, obj2)
// assert.ok(false)

// assert.rejects(
//   () => {
//     throw '错误'
//   }
// ).then(() => {
//   // ...
// }).catch(err => {
//   console.log(err)  // 错误
// })

assert.doesNotReject(
  () => {
    // throw '错误'
    return Promise.reject(11)
  },
  SyntaxError
).then(err => {
  // ...
  // console.log(err)  // 错误
}).catch(err => {
  console.log(err)  // 错误
})