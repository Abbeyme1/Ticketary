import { connectNATS } from "../../../connectNATS"
import { Order } from "../../../models/order";
import { paymentCreatedListener } from "../paymentCreatedListener"
import {OrderStatus, paymentCreatedEvent} from "@ticketary/sharedlibrary"
import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";


const setup = async () => {

    // create listener
    const listener = new paymentCreatedListener(connectNATS.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "ticketNew",
        price: 89
    })

    await ticket.save();

    // create order
    const order = Order.build({
        userId: "assdf",
        expiresAt: new Date(),
        status: OrderStatus.Created,
        ticket
    })

    await order.save();

    const data: paymentCreatedEvent["data"] = {
        id: "sdf",
        orderId: order.id,
        paymentId: "sfosk"
    }

    // @ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }

    return {listener, ticket, order, data, msg};
}

it("updates the order to complete",async ()  => {

    const {listener, ticket, order, data, msg} = await setup();

    await listener.onMessage(data,msg);

    const updatedOrder = await Order.findById(data.orderId);

    expect(updatedOrder?.status).toEqual(OrderStatus.Complete);

})

it("acks the message",async () => {
    const {listener, ticket, order, data, msg} = await setup();

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled()
})