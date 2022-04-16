import { currentUser, NotFoundError, errorHandler } from '@ticketary/sharedlibrary';
import express from 'express';
import cookieSession from "cookie-session";
import { json } from 'body-parser';
import { createOrder } from './routes/createOrder';
import { getOrder } from './routes/getOrder';
import { listOrders } from './routes/listOrders';
import { cancelOrder } from './routes/cancelOrder';
const app = express();


app.set('trust proxy',1);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV === 'production'
}))

app.use(currentUser);
app.use(createOrder);
app.use(getOrder);
app.use(listOrders);
app.use(cancelOrder);

app.all('*', (req,res,next) => {
    throw new NotFoundError()
})


app.use(errorHandler)

export {app};




