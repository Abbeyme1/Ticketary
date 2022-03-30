
import nats,{Message} from 'node-nats-streaming';
import {randomBytes} from 'crypto'
import {TicketCreatedListner} from "./events/listener/ticketCreatedListener";

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


   new TicketCreatedListner(client).listen()
    
})

process.on('SIGINT',() => client.close()) // sig interrupt
process.on('SIGTERM',() => client.close()) // sig terminate