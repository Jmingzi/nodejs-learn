## util工具

本章的目的也是为了熟悉一下内部可以使用的api，按照使用场景来归类，util总览：

- util.promisify(original)
- util.isDeepStrictEqual(val1, val2)
- util.inspect()
- util.deprecate(fn, msg[, code])
- util.format(format)
- util.types
- Class util.TextDecoder
- Class util.TextEncoder

## util.promisify

让一个遵循异常优先的回调风格的函数，即`(err, value) => ...`，异常优先即`err`为回调的第一个参数

符合这种形式的内部模块有

- fs
    ```js
    const readFile = util.promisify(fs.readFile)
    readFile('path').then().catch()
    ```
- ~~child_process里的`exec`和`execFile`~~ 虽然形式上看起来是的，但实际不是
    ```js
    const exec = util.promisify(sub.exec)
    exec('path').then().catch()
    ```
在Node的v10.0.0之后`fs`模块自带promise方法，即

```js
const fs = require('fs').promises
fs.readFile().then().catch()
```

另外，`bluebird`包也支持promise化，例如

```js
const Promise = require('bluebird')
Promise.promisifyAll(fs)

fs.readFileAsync().then().catch()
```
它是在原有的基础上再增加的`Async`后缀名的promise方法

如果在项目中使用除了fs之外的模块，更倾向于用`bluebird`去做Promisify

## util.inspect

返回 object 的字符串表示

```js
const example = {
    name: 'ym',
    age: 18
}
console.log(util.inspect(example))
// 会以字符串的形式输出 { name: 'ym', age: 18 }
```
