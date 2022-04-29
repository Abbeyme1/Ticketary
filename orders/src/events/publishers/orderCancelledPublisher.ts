import { OrderCancelledEvent, OrderCreatedEvent, Publisher, Subjects } from "@ticketary/sharedlibrary";


export class orderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}