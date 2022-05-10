import { OrderStatus } from "@ticketary/sharedlibrary";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";


interface orderAttr {
    id: string,
    version: number, // we dont need it rn, but maybe in future, thts why addding it
    status: OrderStatus,
    userId: string,
    price: number
}

interface orderDoc extends mongoose.Document {
    version: number, 
    status: OrderStatus,
    userId: string,
    price: number
}

interface orderModel extends mongoose.Model<orderDoc> {
    build(attr: orderAttr): orderDoc
    findByEvent(event: {id: string, version: number}): Promise<orderDoc | null>;
}

const orderSchema = new mongoose.Schema({
    status: {
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }

},{
    toJSON: {
        transform: (doc,ret) => {
            ret.id = ret._id;
            delete ret._id
        }
    }
})

orderSchema.set("versionKey","version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attr: orderAttr) => {
    return new Order({
        _id: attr.id,
        version: attr.version,
        status: attr.status,
        userId: attr.userId,
        price: attr.price
    })
}

orderSchema.statics.findByEvent = (event: {id: string, version: number}) => {
    return Order.findOne({
        _id: event.id,
        version: event.version - 1
    })
}


const Order = mongoose.model<orderDoc,orderModel>("Order",orderSchema);

export {Order};