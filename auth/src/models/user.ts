import mongoose from "mongoose";
import { PasswordManager } from "../helper/passwordManager";

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
},{
    toJSON: {
        transform: (doc,ret,options) => {
            delete ret.__v;
            delete ret.password;
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

userSchema.pre("save",async function(next){

    if(this.isModified("password"))
    {
        this.password = await PasswordManager.hashPassword(this.password);
    }
    next();
})

userSchema.statics.build = (attr: userAttr) => {
    return new User(attr)
}

const User =  mongoose.model<userDoc,userModel>('User',userSchema);

export {User};