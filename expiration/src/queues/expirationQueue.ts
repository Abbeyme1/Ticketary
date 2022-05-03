
import Queue from "bull";
import { connectNATS } from "../connectNATS";
import { expirationCompletePublisher } from "../events/publishers/expirationCompletePublisher";

interface OrderPayload {
    orderId: string
}

const expirationQueue = new Queue<OrderPayload>("order:expiration",{
    redis: {
        host: process.env.REDIS_HOST
    }
})

expirationQueue.process(async (job) => {

    new expirationCompletePublisher(connectNATS.client).publish({
        orderId: job.data.orderId
    })

})

export {expirationQueue};