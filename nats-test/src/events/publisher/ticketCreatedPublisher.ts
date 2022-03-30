import { Publisher } from "./publisher";
import { Subjects } from "../subjects";
import { TicketCreatedEvent } from "../ticketCreatedEvent";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.ticketCreated = Subjects.ticketCreated;
    
}