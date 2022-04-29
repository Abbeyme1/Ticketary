import { Listener, NotFoundError, Subjects, TicketUpdatedEvent } from "@ticketary/sharedlibrary";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queueGroupName";
import { Ticket } from "../../models/ticket";


export class ticketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.ticketUpdated = Subjects.ticketUpdated;

    queueGroupName: string = queueGroupName

    async onMessage(data: TicketUpdatedEvent["data"], msg: Message){

        const {id,title,price,version} = data;

        const ticket = await Ticket.findByEvent(data)

        if(!ticket) throw new NotFoundError();

        ticket.set({title,price});

        await ticket.save();

        msg.ack();

    }

}