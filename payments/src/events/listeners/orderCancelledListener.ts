import { Listener, NotFoundError, OrderCancelledEvent, OrderStatus, Subjects } from "@ticketary/sharedlibrary";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queueGroupName";


export class orderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCancelledEvent["data"], msg: Message) {

        const order = await Order.findByEvent(data);

        if(!order) throw new NotFoundError();

        order.set({status: OrderStatus.Cancelled})

        await order.save();

        msg.ack();
        
    }

}