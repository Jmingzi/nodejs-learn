const EventEmitter = require('events');

class MyEmitter extends EventEmitter {
  a() {
  }
}
//
// const myEmitter = new MyEmitter();
// myEmitter.on('event', () => {
//   console.log('触发事件');
// });
// myEmitter.emit('event');

const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // 打印: a b {}
});
myEmitter.emit('event', 'a', 'b');
