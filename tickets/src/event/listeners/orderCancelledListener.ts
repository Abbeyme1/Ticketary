import { Listener, NotFoundError, OrderCancelledEvent, OrderCreatedEvent, OrderStatus, Subjects } from "@ticketary/sharedlibrary";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { ticketUpdatedPublisher } from "../publishers/ticketUpdatedPubisher";
import { queueGroupName } from "./queueGroupName";


export class orderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

    queueGroupName:string = queueGroupName


    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {

        const ticket = await Ticket.findById(data.ticket.id);

        if(!ticket) throw new NotFoundError();

        ticket.set({orderId: undefined});

        await ticket.save();

        new ticketUpdatedPublisher(this.client).publish({
            title: ticket.title,
            version: ticket.version,
            price: ticket.price,
            id: ticket.id,
            userId: ticket.userId,
            orderId: ticket.orderId
        })

        msg.ack();
    }

}