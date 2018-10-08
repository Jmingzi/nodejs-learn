### 在ES2015中有四种相等算法
> [ecma规范定义算法规则](https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations)   
> 7.2.10 SameValue  
> 7.2.11 SameValueZero  
> 7.2.12 SameValueNonNumber  
> 即术语`同值`、`同值零`、`同值非零`

- 抽象相等 `==`
- 严格相等 `===`，用于
  - Array.prototype.indexOf
  - Array.prototype.lastIndexOf
- 同值零，用于
  - Map
  - Set
  - String.prototype.includes
  - ArrayBuffer构造函数
  - TypedArray构造函数
- 同值，用于剩余的其他地方

### 定义

`ECMA`中SameValue比较规则
- 类型不一样，返回false
- 类型为`number`时
  - 都为`NaN`，返回true
  - x为`+0`，y为`-0`时，返回false
- 类型不是`number`时，`return SameValueNonNumber()`

`ECMA`中SameValueZero比较规则
- 类型不一样，返回false
- 类型为`number`时
  - 都为`NaN`，返回true
  - x为`+0`，y为`-0`时，返回true
- 类型不是`number`时，`return SameValueNonNumber()`

`ECMA`中SameValueNonNumber比较规则
- 为`Undefined`，返回true
- 为`Null`，返回true
- 为`String`，则比较这2个字符串的码点
- 为`Object`，则比较是否指向同一个堆地址

SameValue与SameValueZero的差别在于数值类型时`+0`和`-0`

------

JavaScript提供三种不同的值比较操作：

- ==
- === 
- Object.is 

`Object.is`的行为方式与`===`相同，但是对于NaN和-0和+0进行特殊处理

```js
NaN === NaN // false
Object.is(NaN, NaN) // true

+0 === -0 // true
Object.is(+0, -0) // false
```

可以看到`Object.is`采用的`SameValue`算法，而全等可以看作是`SameValueZero`排除`NaN`的情况，因为全等操作符认为 NaN 与其他任何值都不全等，包括它自己。

----

再来看看非严格等于的隐式转换

在被比较的2个值x和y类型不一样时，总是将2者的类型转换为`Number`或`Primitve`

也就是说，当有一方为number时，另一方也会转换为number；否则，会尝试调用该类型的`x.toString()`或`x.valueOf()`方法来将Object转换为原始类型。

> 参考[JavaScript 中的相等性判断](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness)
> [Object.is()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/is)

