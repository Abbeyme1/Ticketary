import mongoose from "mongoose"; 

import {app} from "./app";

const connect = async () => {
  // check if we have secret.. else throw error
  
    if(!process.env.JWT_KEY)
    {
      throw new Error('"JWT_KEY" is not defined');
    }

    try {
      const url = "mongodb://auth-mongo-srv:27017/auth";
      const conn = await mongoose.connect(url);
  
      console.log("connected to mongodb");
    } catch (err) {
      console.log(`ERR: ${err}`);
    }

    app.listen(3000,() => {
        console.log("listening at 3000");
    })
};

connect();


