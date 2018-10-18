const redis = require('redis')
// const bluebird = require('bluebird')
// const sub = redis.createClient()
// const pub = redis.createClient()
var sub = redis.createClient(), pub = redis.createClient();
// bluebird.promisifyAll(redis)

sub.on('subscribe', function(channel, count) {
    // pub.publish('pub channel', channel, count)
    // console.log(channel, count)
    // pub.publish('pub channel', 'pub发布事件1')
    // pub.publish('pub channel', 'pub发布事件2')
    pub.publish("a nice channel", "I am sending a message.");
    pub.publish("a nice channel", "I am sending a second message.");
    pub.publish("a nice channel", "I am sending my last message.");
})
sub.on('message', function(channel, message) {
    // console.log('sub接收到事件' + channel + message)
    console.log("sub channel " + channel + ": " + message);
    // sub.unsubscribe()
    // sub.unsubscribe();
    // sub.quit();
    // pub.quit();
})
sub.subscribe('sub的订阅事件')
// sub.subscribe('a nice channel')

// client.onAsync('error').then(res => {
//     console.log(res)
// })

// client.set('a', 1, (err, reply) => {
//     console.log(err, reply)
// })

// client.set('a', '1')
// client.getAsync('a').then(res => {
//     console.log(res)
// })

// client.EXISTS('a').then(res => {
//     console.log(res)
// })

// client.HMSETAsync('key2', {
//     "0123456789": "abcdefghij", // NOTE: key and value will be coerced to strings
//     "some manner of key": "a type of value"
// })
//
// client.hgetallAsync('key2').then(res => {
//     console.log(res)
// })
//
// client.existsAsync('key2').then(res => {
//     console.log(res)
// })
//
// client.keysAsync('*').then(res => {
//     console.log(res)
// })