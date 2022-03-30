import { Subjects } from "./subjects";

export interface TicketCreatedEvent {

    subject: Subjects.ticketCreated
    data: {
        title: string
        price: number
        id: string
    }
    
}