import mongoose from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server"
import jwt from "jsonwebtoken";

jest.mock("../connectNATS");

let mongoServer: MongoMemoryServer


const connect = async () => {

    process.env.JWT_KEY = 'sfd';
    mongoServer = await MongoMemoryServer.create();
    const uri = await mongoServer.getUri();
    await mongoose.connect(uri);
}

const close = async () => {
    jest.clearAllMocks();
    await mongoose.disconnect();
    await mongoServer.stop();
}

const clear = async () => {
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections)
        await collection.deleteMany({})
}


beforeAll(async () => await connect())

beforeEach(async () => await clear())

afterAll(async() => await close())


declare global {
    function signin(): string[]
}


global.signin =  () => {

    const userId = new mongoose.Types.ObjectId().toHexString()
    
    const payload = {name: "ddf" ,id: userId, email: "a@da.com"}

    const token = jwt.sign(payload,process.env.JWT_KEY!)

    const session = {jwt: token}

    const json = JSON.stringify(session);

    const buffer = Buffer.from(json).toString("base64");

    const str = `session=${buffer}`

    return [str];

}