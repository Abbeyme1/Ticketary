
import nats from 'node-nats-streaming';

const client = nats.connect('ticketary', 'publisher',{
    url: "http://localhost:4222"
})
console.clear();

client.on("connect",() => {
    console.log("Publisher Connected")

    const data = JSON.stringify({
        title: "abc",
        price: 85,
        id: "sfjsjfsjfsjfslfjs"
    })

    client.publish('ticket:created', data,(err,guid) => {
        console.log("sent message ")
    })
})
