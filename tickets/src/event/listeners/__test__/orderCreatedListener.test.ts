import { OrderCreatedEvent, OrderStatus } from "@ticketary/sharedlibrary";
import mongoose from "mongoose";
import { connectNATS } from "../../../connectNATS"
import { Ticket } from "../../../models/ticket";
import { orderCreatedListner } from "../orderCreatedListener"
import {Message} from "node-nats-streaming"

const setup = async () => {

    // create listner
    const listener = new orderCreatedListner(connectNATS.client);

    const ticket = Ticket.build({
        title: "abcd",
        price: 8,
        userId: "pqrs"
    })

    await ticket.save()

    const data: OrderCreatedEvent["data"] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        expiresAt: new Date().toDateString(),
        ticket: {
            id: ticket.id,
            price: ticket.price,
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener,ticket,data,msg};
}


it("find and update/lock the ticket",async () => {
    const {listener,ticket, data, msg} = await setup();

    await listener.onMessage(data,msg);

    const updatedticket = await Ticket.findById(ticket.id);

    expect(updatedticket?.orderId).toEqual(data.id)

     
})

it("acks the message",async () => {

    const {listener, data, msg} = await setup();

    await listener.onMessage(data,msg);

    expect(msg.ack).toHaveBeenCalled()
})

it("publishes ticketUpdated event",async () => {

    const {listener, data, msg} = await setup();

    await listener.onMessage(data,msg); 

    expect(connectNATS.client.publish).toHaveBeenCalled()

    const updatedTicketData = JSON.parse((connectNATS.client.publish as jest.Mock).mock.calls[0][1]);

    expect(updatedTicketData.orderId).toEqual(data.id)

    
})