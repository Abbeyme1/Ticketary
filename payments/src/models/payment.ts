import mongoose from "mongoose";

interface paymentAttr {
    orderId: string,
    paymentId: string
}


interface paymentDoc extends mongoose.Document {
    orderId: string,
    paymentId: string
}

interface paymentModel extends mongoose.Model<paymentDoc> {
    build(attr: paymentAttr): paymentDoc
}

const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
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

paymentSchema.statics.build = (attr: paymentAttr) => {
    return new Payment(attr);
}

const Payment = mongoose.model<paymentDoc,paymentModel>("Payment",paymentSchema);


export {Payment};


