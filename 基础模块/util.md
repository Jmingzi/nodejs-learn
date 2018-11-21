## util工具

本章的目的也是为了熟悉一下内部可以使用的api，按照使用场景来归类，util总览：

- util.promisify(original)
- util.isDeepStrictEqual(val1, val2)
- util.callbackify(original)
- util.debuglog(section)
- util.deprecate(fn, msg[, code])
- util.format(format)
- util.inspect()
- util.types
- Class util.TextDecoder
- Class util.TextEncoder

## util.promisify

让一个遵循异常优先的回调风格的函数，即`(err, value) => ...`，异常优先即`err`为回调的第一个参数

符合这种形式的内部模块有

- `fs`
    ```js
    const readFile = util.promisify(fs.readFile)
    readFile('path').then().catch()
    ```
- ~~`child_process`里的`exec`和`execFile`~~ 虽然形式上看起来是的，但实际不是
    ```js
    const exec = util.promisify(sub.exec)
    exec('path').then().catch()
    ```

