import { currentUser, NotFoundError, errorHandler } from '@ticketary/sharedlibrary';
import express from 'express';
import {createTicket} from "./routes/createTicket";
import cookieSession from "cookie-session";
import { json } from 'body-parser';
import { getTicket } from './routes/getTicket';
import { listTickets } from './routes/listTickets';
import { updateTicket } from './routes/updateTicket';

const app = express();


app.set('trust proxy',1);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === 'production'
}))

app.use(currentUser);
app.use(createTicket);
app.use(getTicket);
app.use(listTickets);
app.use(updateTicket);


app.all('*', (req,res,next) => {
    throw new NotFoundError()
})


app.use(errorHandler)

export {app};




