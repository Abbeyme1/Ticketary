import { Publisher, Subjects, TicketCreatedEvent } from "@ticketary/sharedlibrary";

export class ticketCratedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.ticketCreated = Subjects.ticketCreated;
}