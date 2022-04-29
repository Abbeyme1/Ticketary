import { Listener, Subjects, TicketCreatedEvent } from "@ticketary/sharedlibrary";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queueGroupName";


export class ticketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.ticketCreated = Subjects.ticketCreated;

    queueGroupName: string = queueGroupName

    async onMessage(data: TicketCreatedEvent["data"], msg: Message) {

        const {id,title,price} = data;

        const ticket = Ticket.build({
            id,title,price
        })

        await ticket.save();
        
        msg.ack();
    }

}