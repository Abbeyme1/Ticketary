import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import {currentUserRouter} from './routes/currentuser'
import {signUpRouter} from './routes/signup'
import {signInRouter} from './routes/signin'
import {signOutRouter} from './routes/signout'
import { errorHandler } from './middlewares/errorHandler';
import { NotFoundError } from './errors/notFoundError';
import mongoose from "mongoose"; 

const app = express();
app.use(json())

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);

app.all('*',async (req,res) => {
    throw new NotFoundError();
})

app.use(errorHandler);

const connect = async () => {
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


