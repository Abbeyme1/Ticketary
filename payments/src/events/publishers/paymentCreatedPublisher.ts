import { paymentCreatedEvent, Publisher, Subjects } from "@ticketary/sharedlibrary";

export class paymentCreatedPublisher extends Publisher<paymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}