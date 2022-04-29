import { TicketUpdatedEvent } from "@ticketary/sharedlibrary";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { connectNATS } from "../../../connectNATS"
import { Ticket } from "../../../models/ticket";
import { ticketUpdatedListener } from "../ticketUpdatedListener"

const setup = async () => {

    const listener = new ticketUpdatedListener(connectNATS.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "abcd",
        price: 52
    })

    await ticket.save();

    const data: TicketUpdatedEvent["data"] = {
        title: "random",
        version: ticket.version+1,
        price: 50,
        id: ticket.id,
        userId: "kkk",
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {listener,ticket,data,msg}
}

it("updates and saves ticket",async () => {

    const {listener,ticket,data,msg} = await setup();

    await listener.onMessage(data,msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket?.title).toEqual(data.title);
    expect(updatedTicket?.price).toEqual(data.price);
    expect(updatedTicket?.version).toEqual(data.version);


})

it("acks the message",async () => {

    const {listener,ticket,msg,data} = await setup();

    await listener.onMessage(data,msg);
    
    expect(msg.ack).toHaveBeenCalled();
})

it("failed to ack as version number doesn't match",async () => {

    const {listener,ticket,data,msg} = await setup();

    data.version = 3;

    try {
        await listener.onMessage(data,msg);
    }
    catch(err)
    {

    }
    

    expect(msg.ack).not.toHaveBeenCalled();

})