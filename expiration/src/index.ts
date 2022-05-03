import { connectNATS } from "./connectNATS";
import { orderCreatedListener } from "./events/listeners/orderCreatedListener";

const connect = async () => {


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

    if(!process.env.REDIS_HOST)
    {
      throw new Error('"REDIS_HOST" is not defined')
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

   
    } catch (err) {
      console.log(`ERR: ${err}`);
    }

};

connect();