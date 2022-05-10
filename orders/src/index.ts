import { app } from "./app";
import mongoose from "mongoose";
import { connectNATS } from "./connectNATS";
import { ticketCreatedListener } from "./events/listeners/ticketCreatedListener";
import { ticketUpdatedListener } from "./events/listeners/ticketUpdatedListener";
import { expirationCompleteListener } from "./events/listeners/expirationCompleteListener";
import { paymentCreatedListener } from "./events/listeners/paymentCreatedListener";

const connect = async () => {

  if (!process.env.JWT_KEY) {
    throw new Error('"JWT_KEY" is not defined')
  }

  if (!process.env.MONGO_URL) {
    throw new Error('"MONGO_URL" is not defined')
  }

  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('"NATS_CLUSTER_ID" is not defined')
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('"NATS_CLIENT_ID" is not defined')
  }

  if (!process.env.NATS_URL) {
    throw new Error('"NATS_URL" is not defined')
  }

  try {

    await connectNATS.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

    connectNATS.client.on("close", () => {
      console.log("listener connection lost")
      process.exit();
    })

    process.on('SIGINT', () => connectNATS.client.close()) // sig interrupt
    process.on('SIGTERM', () => connectNATS.client.close()) // sig terminate

    new ticketCreatedListener(connectNATS.client).listen()
    new ticketUpdatedListener(connectNATS.client).listen()
    new expirationCompleteListener(connectNATS.client).listen()
    new paymentCreatedListener(connectNATS.client).listen()




    // const url = "mongodb://tickets-mongo-srv:27017/tickets";
    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log("connected to mongodb");
  } catch (err) {
    console.log(`ERR: ${err}`);
  }

  app.listen(3000, () => {
    console.log("listening at 3000");
  })
};

connect();