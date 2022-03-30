import { Stan } from "node-nats-streaming";
import { Event } from "../event";

export abstract class Publisher<T extends Event> {
    abstract subject:Event['subject'];
    private client:Stan;

    constructor(client: Stan)
    {
        this.client = client;
    }

    publish(data: T['data']):Promise<void>
    {
        return new Promise((resolve,reject) => {

            this.client.publish(this.subject,JSON.stringify(data),(err) => {
                if(err) return reject(err)

                console.log("Event published")

                resolve()
            })
        })
        
    }

}