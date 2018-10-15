## 观察者模式与发布订阅模式

在events模块中，涉及的便是发布订阅模式，鉴于此来了解下2者的概念与差异。

我认为，既然存在这2个概念，那么它们就是不一样的东西，虽然有相似之处。

## 观察者模式

在观察者模式中，为一对多的关系，称为目标与观察者，也就是说一个目标对应多个观察者，且目标与观察者是耦合关系。

因为目标需要知道
- 收集有哪些观察者
- 通过何种方式来通知观察者

场景：

> 公司A收到N份面试者的简历并记录了联系方式，这里的A就是目标，面试者就是观察者，目标是清楚观察者是谁，联系方式是多少的，这里的联系方式就是耦合的关系。

用经典的代码来表示：

```js
// 观察者
class Observe {
    update(context) {
        console.log('我收到了公司面试邀请，公司是', context)
    }
}

// 用来存放观察者
class ObserveList {
    constructor() {
        this.observeList = []
    }

    add(observer) {
        this.observeList.push(observer)
    }

    get() {
        return this.observeList
    }

    remove(index) {
    }
}

class Subject {
    constructor() {
        this.observers = new ObserveList()
    }

    addObserver(observer) {
        this.observers.add(observer)
    }

    removeObserver(observer) {
    }

    notify() {
        const observerList = this.observers.get()
        observerList.forEach(item => item.update(this))
    }
}

const sub = new Subject()
const ob1 = new Observe()
const ob2 = new Observe()

sub.addObserver(ob1)
sub.addObserver(ob2)

sub.notify()
// 我收到了公司面试邀请，公司是 Subject {observers: ObserveList}
// 我收到了公司面试邀请，公司是 Subject {observers: ObserveList}
```

## 发布订阅模式

发布者与订阅者之间是没有关系的，它们彼此都不知道彼此，它们中间由中介去分发事件，它们的唯一关系就是事件名称。一个事件也是对应多个订阅者的。

这个模式更适用于现实的业务逻辑中，因为不存在耦合，更灵活

场景：

> 公司A发布招聘信息岗位M到平台上，N个面试者申请了岗位M并填写了联系方式，公司A的点击按钮通知面试申请者来面试，平台将岗位M的申请者加入到发消息的队列中，按照申请者填写的联系方式发消息。

这里的平台就是中介，也称调度中心。

代码示例：

```js
class pubSub {
    constructor() {
        this.topics = {}
        this.uid = 0
    }
    
    subscrib(topic, callback) {
        if (!this.topics[topic]) {
            this.topics[topic] = []
        }
        
        this.topics[topic].push({
            id: this.uid + 1,
            callback
        })
    }
    
    unsubscribe(uid) {
        // ...
    }
    
    publish(topic, message) {
        this.topics[topic].forEach(item => item.callback(message))
    }
}
```





