import { OrderCancelledEvent, OrderStatus } from "@ticketary/sharedlibrary";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { connectNATS } from "../../../connectNATS";
import { Order } from "../../../models/order";
import { orderCancelledListener } from "../orderCancelledListener";

const setup = async () => {

     const listener = new orderCancelledListener(connectNATS.client);

     const order = Order.build({
         id: new mongoose.Types.ObjectId().toHexString(),
         userId: "abcd",
        version: 0,
        status: OrderStatus.Created,
        price: 88
    })

    await order.save();

     const data: OrderCancelledEvent["data"] = {
        id: order.id,
        version: 1,
        ticket: {
            id: "string",
        }
     }

     // @ts-ignore
     const msg: Message = {
         ack: jest.fn()
     }

     return {order,listener, data, msg};
}



it("mark order as cancelled",async () => {
    const {order,listener, data, msg} = await setup();

    await listener.onMessage(data,msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled);


})

it("acks the message",async () => {
    const {order,listener, data, msg} = await setup();

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled()


})