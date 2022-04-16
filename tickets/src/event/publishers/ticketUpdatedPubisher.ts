import { Publisher, Subjects, TicketUpdatedEvent } from "@ticketary/sharedlibrary";

export class ticketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.ticketUpdated = Subjects.ticketUpdated;
}