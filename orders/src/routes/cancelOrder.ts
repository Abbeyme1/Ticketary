import express,{Request,Response,NextFunction} from "express";
import {NotFoundError, OrderStatus, requireAuth, UnauthorizedError} from "@ticketary/sharedlibrary"
import { Order } from "../models/order";
import { orderCancelledPublisher } from "../events/publishers/orderCancelledPublisher";
import { connectNATS } from "../connectNATS";

const router = express.Router();


router.delete("/api/orders/:orderId",
requireAuth,
async (req:Request,res:Response,next:NextFunction) => {

    try {
        const {orderId} = req.params;
        let order = await Order.findById(orderId).populate("ticket");
        if(!order) throw new NotFoundError();

        if(order?.userId !== req.currentUser!.id) throw new UnauthorizedError();

        order.status = OrderStatus.Cancelled;
        await order.save();

        new orderCancelledPublisher(connectNATS.client).publish({
            id: order.id,
            version: order.ticket.version,
            ticket: {
                id: order.ticket.id
            }
        })

        res.status(204).send(order);
    }
    catch(err) {next(err);}
    
})


export {router as cancelOrder}