import { OrderCreatedEvent, OrderStatus } from "@ticketary/sharedlibrary";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { connectNATS } from "../../../connectNATS";
import { Order } from "../../../models/order";
import { orderCreatedListener } from "../orderCreatedListener";

const setup = async () => {

     const listener = new orderCreatedListener(connectNATS.client);

     const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: "abcd",
        version: 0,
        status: OrderStatus.Created,
        expiresAt: "d",
        ticket: {
            id: "string",
            price: 89
        }
     }

     // @ts-ignore
     const msg: Message = {
         ack: jest.fn()
     }

     return {listener, data, msg};
}


it('order created',async () => {

    const {listener, data, msg} = await setup();

    await listener.onMessage(data,msg);

    const order = await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price)
})


it('acks the message',async () => {

    const {listener, data, msg} = await setup();

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled()
})