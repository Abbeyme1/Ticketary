import nats,{Stan} from 'node-nats-streaming';

class ConnectNATS {

    private _client?:Stan;

    get client() {
        if(!this._client)
        {
            throw new Error("Cannot access NATS before connecting")
        }
        return this._client;
    }

    connect(clusterID:string,clientID: string,url:string) {

        this._client = nats.connect(clusterID,clientID,{url})

        return new Promise<void>((resolve,reject) => {

            this.client.on("connect",() => {
                console.log("CONNECTED TO NATS")
                resolve()
            })
            
            this.client.on("error",(err:any) => {
                reject(err);
            })
        })
        


    }
}

export const connectNATS = new ConnectNATS();