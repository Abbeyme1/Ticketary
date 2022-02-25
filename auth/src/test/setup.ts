import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';

let mongoServer : MongoMemoryServer;

const connect = async () => {

    process.env.JWT_KEY = 'asdf';
    mongoServer = await MongoMemoryServer.create();
    
    const url = await mongoServer.getUri();
    await mongoose.connect(url);
}

const clear = async () => {
    let collections = await mongoose.connection.collections;

    for(let key in collections)
        collections[key].deleteMany({})
}

const close = async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
}


beforeAll(async () => await connect())

beforeEach(async () => await clear())

afterAll(async () => await close())



declare global {
    function signin(): Promise<string[]>
}

global.signin = async () => {
    const res = await request(app)
    .post('/api/users/signup')
    .send({
      name: "Test",
      email: 'test@test.com', 
      password: 'password'
    })
    .expect(201);

    const cookie = res.get('Set-Cookie');

    return cookie;
}