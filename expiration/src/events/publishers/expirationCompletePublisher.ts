import { ExpirationCompleteEvent, Publisher, Subjects } from "@ticketary/sharedlibrary";


export class expirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}