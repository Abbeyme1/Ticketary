
import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/publisher/ticketCreatedPublisher';

const client = nats.connect('ticketary', 'publisher',{
    url: "http://localhost:4222"
})
console.clear();

client.on("connect",async () => {
    console.log("Publisher Connected")

    const data = {
        title: "abc",
        price: 85,
        id: "sfjsjfsjfsjfslfjs"
    }

    const publisher = new TicketCreatedPublisher(client)

    try {
        await publisher.publish(data);
    }
    catch(err)
    {
        console.error(err)
    }
    
})
 