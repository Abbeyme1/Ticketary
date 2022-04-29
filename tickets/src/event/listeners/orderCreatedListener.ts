import { Listener, NotFoundError, OrderCreatedEvent, OrderStatus, Subjects } from "@ticketary/sharedlibrary";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { ticketUpdatedPublisher } from "../publishers/ticketUpdatedPubisher";
import { queueGroupName } from "./queueGroupName";


export class orderCreatedListner extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

    queueGroupName:string = queueGroupName


    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {

        const ticket = await Ticket.findById(data.ticket.id);

        if(!ticket) throw new NotFoundError();

        ticket.set({orderId: data.id})

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