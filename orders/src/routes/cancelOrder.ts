import express,{Request,Response,NextFunction} from "express";
import {NotFoundError, OrderStatus, requireAuth, UnauthorizedError} from "@ticketary/sharedlibrary"
import { Order } from "../models/order";

const router = express.Router();


router.delete("/api/orders/:orderId",
requireAuth,
async (req:Request,res:Response,next:NextFunction) => {

    try {
        const {orderId} = req.params;
        let order = await Order.findById(orderId);
        if(!order) throw new NotFoundError();

        if(order?.userId !== req.currentUser!.id) throw new UnauthorizedError();

        order.status = OrderStatus.Cancelled;
        await order.save();

        res.status(204).send(order);
    }
    catch(err) {next(err);}
    
})


export {router as cancelOrder}