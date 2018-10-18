const redis = require('redis')
const bluebird = require('bluebird')
const client = redis.createClient(811)

bluebird.promisifyAll(redis)

client.onAsync('error').then(res => {
    console.log(res)
})

client.set('a', '1')
client.getAsync('a').then(res => {
    console.log(res)
})
