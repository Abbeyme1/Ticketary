import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';


interface ticketAttr {
    id: string,
    title: string,
    price: number
}

interface ticketDoc extends mongoose.Document{
    title: string,
    price: number,
    isReserved(): Promise<boolean>,
    version: number
}

export {ticketDoc}


interface ticketModel extends mongoose.Model<ticketDoc> {
    build(attr: ticketAttr) : ticketDoc;
    findByEvent(event: {id: string, version: number}) : Promise<ticketDoc | null>
}


const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
},
{
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
        }
      }
})


ticketSchema.set("versionKey","version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attr: ticketAttr) => {
    return new Ticket({
        _id: attr.id,
        title: attr.title,
        price: attr.price
    });
}

ticketSchema.statics.findByEvent = (event: {id: string, version: number}) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version-1
    });
}

ticketSchema.methods.isReserved = async function() {
    
    let existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    })


    return !!existingOrder;
}


const Ticket = mongoose.model<ticketDoc,ticketModel>("Ticket",ticketSchema)

export {Ticket}