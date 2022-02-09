import mongoose from "mongoose";
import { Password } from "../helper/hashPassword";

// using interface to descrbe what all specific attrs.
// we need (telling typescript)
interface userAttr {
    name: string,
    email: string,
    password: string
}

// interface to create our own customer create/build model 
// that will help us creating model using typescript features
// [ just to use ts in mongoose]

interface userModel extends mongoose.Model<userDoc> {
    build(attr: userAttr): userDoc;
}


//this interface will limit mongoose to add unwanted attributes like createdAt, updatedAt, etc
interface userDoc extends mongoose.Document {
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

userSchema.pre("save",async function(next){

    if(this.isModified("password"))
    {
        this.password = await Password.hashPassword(this.password);
    }
    next();
})

userSchema.statics.build = (attr: userAttr) => {
    return new User(attr)
}

const User =  mongoose.model<userDoc,userModel>('User',userSchema);

export {User};