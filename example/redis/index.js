const redis = require('redis')
const bluebird = require('bluebird')
const client = redis.createClient()

bluebird.promisifyAll(redis)

client.onAsync('error').then(res => {
    console.log(res)
})

client.set('a', '1')
client.getAsync('a').then(res => {
    console.log(res)
})

// client.EXISTS('a').then(res => {
//     console.log(res)
// })

client.HMSETAsync('key2', {
    "0123456789": "abcdefghij", // NOTE: key and value will be coerced to strings
    "some manner of key": "a type of value"
})

client.hgetallAsync('key2').then(res => {
    console.log(res)
})

client.existsAsync('key2').then(res => {
    console.log(res)
})