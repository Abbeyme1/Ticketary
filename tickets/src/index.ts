import {app} from "./app";
import mongoose from "mongoose";


const connect = async () => {

    if(!process.env.JWT_KEY)
    {
      throw new Error('"JWT_KEY" is not defined')
    }

    if(!process.env.MONGO_URL)
    {
      throw new Error('"MONGO_URL" is not defined')
    }

    try {
      // const url = "mongodb://tickets-mongo-srv:27017/tickets";
      const conn = await mongoose.connect(process.env.MONGO_URL);
  
      console.log("connected to mongodb");
    } catch (err) {
      console.log(`ERR: ${err}`);
    }

    app.listen(3000,() => {
        console.log("listening at 3000");
    })
};

connect();