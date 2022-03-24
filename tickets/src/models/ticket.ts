import mongoose from 'mongoose';


interface ticketAttr {
    title: string,
    price: number,
    userId: string
}

interface ticketDoc extends mongoose.Document {
    title: string,
    price: number,
    userId: string
}

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
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    
},{
    toJSON: {
        transform: (doc,ret,options) => {
            delete ret.__v;
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

ticketSchema.statics.build = (attr: ticketAttr) => {
    return new Ticket(attr);
}

const Ticket =  mongoose.model<ticketDoc,ticketModel>('Ticket',ticketSchema);

export {Ticket};


//title : name of event
// price : price of ticket
// userID : owner of ticket
