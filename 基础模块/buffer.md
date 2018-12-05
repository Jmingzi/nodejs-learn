## 概念

Buffer是一个类数组，每个元素为十六进制的2位数，所以可表示的范围是`00 ~ ff`即 0 - 255 范围的256位数。

## Buffer的赋值

```js
// 申请字节长度为10的内存，且重置为0
const buf = Buffer.alloc(10)

buf.write(string[, offset[, length]][, encoding])
buf.fill(string[, offset[, length]][, encoding])
```

