import { TicketCreatedEvent } from "@ticketary/sharedlibrary"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { connectNATS } from "../../../connectNATS"
import { Ticket } from "../../../models/ticket"
import { ticketCreatedListener } from "../ticketCreatedListener"

const setup = async () => {

    const data: TicketCreatedEvent["data"] = {
        title: "abcd",
        version: 0,
        price: 50,
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    const listener = new ticketCreatedListener(connectNATS.client);

    return {listener,msg,data}
}



it("creates and saves ticket from received event",async () => {

    const {listener,msg,data} = await setup();

    await listener.onMessage(data,msg)

    const fetchTicket = await Ticket.findById(data.id);

    expect(fetchTicket).toBeDefined();
    expect(fetchTicket?.title).toEqual(data.title);
    expect(fetchTicket?.price).toEqual(data.price);

})

it("acks the message",async () => {

    const {listener,msg,data} = await setup();

    await listener.onMessage(data,msg);
    
    expect(msg.ack).toHaveBeenCalled();
})