import {app} from "./app";
import mongoose from "mongoose";
import { connectNATS } from "./connectNATS";
import { orderCreatedListener } from "./events/listeners/orderCreatedListener";
import { orderCancelledListener } from "./events/listeners/orderCancelledListener";

const connect = async () => {

    if(!process.env.JWT_KEY)
    {
      throw new Error('"JWT_KEY" is not defined')
    }

    if(!process.env.MONGO_URL)
    {
      throw new Error('"MONGO_URL" is not defined')
    }

    if(!process.env.NATS_CLUSTER_ID)
    {
      throw new Error('"NATS_CLUSTER_ID" is not defined')
    }

    if(!process.env.NATS_CLIENT_ID)
    {
      throw new Error('"NATS_CLIENT_ID" is not defined')
    }

    if(!process.env.NATS_URL)
    {
      throw new Error('"NATS_URL" is not defined')
    }

    try {

      await connectNATS.connect(process.env.NATS_CLUSTER_ID,process.env.NATS_CLIENT_ID,process.env.NATS_URL);
      
      connectNATS.client.on("close",() => {
        console.log("listener connection lost")
        process.exit();
      })
      
      process.on('SIGINT',() => connectNATS.client.close()) // sig interrupt
      process.on('SIGTERM',() => connectNATS.client.close()) // sig terminate

      new orderCreatedListener(connectNATS.client).listen()
      new orderCancelledListener(connectNATS.client).listen()
   
      
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