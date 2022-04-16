import {OrderStatus} from "@ticketary/sharedlibrary"
import mongoose from "mongoose"
import { ticketDoc } from "./ticket"

export {OrderStatus}

interface orderAttr {
    userId: string,
    status: OrderStatus,
    expiresAt: Date
    ticket: ticketDoc
}

interface orderDoc extends mongoose.Document{
    userId: string,
    status: OrderStatus,
    expiresAt: Date
    ticket: ticketDoc

}

interface orderModel extends mongoose.Model<orderDoc> {
    build(attr: orderAttr) : orderDoc
}


const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created,
        required: true
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date,
        required: true
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Ticket'
    }
}, {
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
        }
      }
})


orderSchema.statics.build = (attr: orderAttr) => {
    return new Order(attr);
}

const Order =  mongoose.model<orderDoc,orderModel>("Order", orderSchema)

export {Order};