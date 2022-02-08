import mongoose from "mongoose";


interface userAttr {
    name: string,
    email: string,
    password: string
}

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    password: {
        type:String,
        required: true
    }
})

userSchema.statics.create = (attr: userAttr) => {
    return new User(attr)
}

const User =  mongoose.model('User',userSchema);


export {User}