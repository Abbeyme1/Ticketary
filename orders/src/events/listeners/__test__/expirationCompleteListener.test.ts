import { ExpirationCompleteEvent, OrderStatus } from "@ticketary/sharedlibrary";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { connectNATS } from "../../../connectNATS"
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { expirationCompleteListener } from "../expirationCompleteListener"


const setup = async () => {

    const listener = new expirationCompleteListener(connectNATS.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "abcd",
        price: 8
    })

    await ticket.save();

    const order = Order.build({
        userId: "abcd",
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket
    })
    await order.save()

    //fake data
    const data: ExpirationCompleteEvent["data"] = {
        orderId: order.id
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener,ticket,order,data,msg}
}


it("update OrderStatus to Cancelled",async () => {
    const {listener,ticket,order,data,msg} = await setup()

    await listener.onMessage(data,msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);
})

it("doesn't update orders with OrderStatus of completed",async () => {
    const {listener,ticket,order,data,msg} = await setup()

    order.set({
        status: OrderStatus.Complete
    })

    await order.save();

    await listener.onMessage(data,msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder?.status).toEqual(OrderStatus.Complete);
    expect(msg.ack).toHaveBeenCalled();
})

it('acks the message',async () => {
    const {listener,ticket,order,data,msg} = await setup()

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled();
})

it('publishes the order cancelled event',async () => {
    const {listener,ticket,order,data,msg} = await setup()

    await listener.onMessage(data,msg);

    expect(connectNATS.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse((connectNATS.client.publish as jest.Mock).mock.calls[0][1]);

    expect(eventData.id).toEqual(order.id)
})