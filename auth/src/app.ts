import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors';
import {currentUserRouter} from './routes/currentuser'
import {signUpRouter} from './routes/signup'
import {signInRouter} from './routes/signin'
import {signOutRouter} from './routes/signout'
import { errorHandler,NotFoundError } from '@ticketary/sharedlibrary';
import cookieSession from "cookie-session";

const app = express();

app.use(json())

// to make node.js trust ingress proxy req.
app.set('trust proxy',1);

app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV === 'production'
}))


app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);

app.all('*',async (req,res) => {
    throw new NotFoundError();
})

app.use(errorHandler);

export {app};
