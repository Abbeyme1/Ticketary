import {Message,Stan} from 'node-nats-streaming';
import { Subjects } from '../subjects';
import {Event} from "../event";

export abstract class Listener<T extends Event> {

    abstract subject: T["subject"];
    private client: Stan;
    protected ackwait: number = 5*1000;
    abstract onMessage(data: T["data"], msg: Message): void;
    abstract queueGroupName: string

    constructor(client: Stan)
    {
        this.client = client;
    }

    setSubscriptionOptions() {
        return this.client
        .subscriptionOptions()
        .setDeliverAllAvailable()
        .setManualAckMode(true)
        .setAckWait(this.ackwait)
        .setDurableName(this.queueGroupName)
    }

    listen() {
        const subscription = this.client.subscribe(this.subject, this.queueGroupName,this.setSubscriptionOptions());

        subscription.on("message",(msg: Message) => {
            console.log(`Message received : ${this.subject} / ${this.queueGroupName}`)

            const parseData = this.parseMessage(msg);
            this.onMessage(parseData,msg);
        })
    }

    parseMessage(msg: Message)
    {
        const data = msg.getData();
        return typeof data === 'string' ? 
        JSON.parse(data)
        : JSON.parse(data.toString('utf8'))
    }
}