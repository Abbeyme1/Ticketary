import { Message } from "node-nats-streaming";
import { Listener } from "./listener";
import { Subjects } from "../subjects";
import { TicketCreatedEvent } from "../ticketCreatedEvent";

export class TicketCreatedListner extends Listener<TicketCreatedEvent> {
    readonly subject:Subjects.ticketCreated = Subjects.ticketCreated
    queueGroupName = "payment-service"
    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log("Data = ", data , msg.getSequence());
        msg.ack()
    }
}