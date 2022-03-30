
import nats,{Message} from 'node-nats-streaming';
import {randomBytes} from 'crypto'

const random = randomBytes(4).toString('hex')
const client = nats.connect('ticketary', random,{
    url: "http://localhost:4222"
})

console.clear();
client.on("connect",() => {
    
    console.log("listener connected")

   client.on("close",() => {
        console.log("listener connection lost")
       process.exit();
   })

    const opts = client.subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName('durable-subs')
    .setAckWait(10)
    .setDurableName('abc')

    const subscription = client.subscribe('ticket:created',"grp",opts);

    subscription.on('message',(msg:Message) => {
        console.log("Msg ", msg.getSequence() + " " + msg.getData())
        msg.ack()
    })
})

process.on('SIGINT',() => client.close()) // sig interrupt
process.on('SIGTERM',() => client.close()) // sig terminate
process.on('SIGABRT',() => client.close()) // sig terminate