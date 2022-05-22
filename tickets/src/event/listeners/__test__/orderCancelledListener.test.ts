import { OrderCancelledEvent, OrderStatus } from "@ticketary/sharedlibrary";
import mongoose from "mongoose";
import { connectNATS } from "../../../connectNATS"
import { Ticket } from "../../../models/ticket";
import {Message} from "node-nats-streaming"
import { orderCancelledListener } from "../orderCancelledListener";

const setup = async () => {

    // create listner
    const listener = new orderCancelledListener(connectNATS.client);

    const ticket = Ticket.build({
        title: "abcd",
        price: 8,
        userId: "pqrs",
        description: "Sd"
    })

    const orderId = new mongoose.Types.ObjectId().toHexString();
    ticket.set({orderId})

    await ticket.save()

    const data: OrderCancelledEvent["data"] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
            
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener,ticket,orderId,data,msg};
}


it("find and update/unlock the ticket",async () => {
    const {listener,ticket, data, msg} = await setup();

    await listener.onMessage(data,msg);

    const updatedticket = await Ticket.findById(ticket.id);

    expect(updatedticket!.orderId).not.toBeDefined();

     
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

    expect(updatedTicketData.orderId).toEqual(undefined)

    
})