import { OrderCreatedEvent, Publisher, Subjects } from "@ticketary/sharedlibrary";


export class orderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}