import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";


interface ticketAttr {
    title: string,
    price: number
}

interface ticketDoc extends mongoose.Document{
    title: string,
    price: number
    isReserved(): Promise<boolean>
}

export {ticketDoc}


interface ticketModel extends mongoose.Model<ticketDoc> {
    build(attr: ticketAttr) : ticketDoc
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

ticketSchema.statics.build = (attr: ticketAttr) => {
    return new Ticket(attr);
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