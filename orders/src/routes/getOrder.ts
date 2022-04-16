import express,{Request,Response,NextFunction} from "express";

import {NotFoundError, requireAuth, UnauthorizedError} from "@ticketary/sharedlibrary"
import { Order } from "../models/order";

const router = express.Router();


router.get("/api/orders/:orderId",
requireAuth,
async (req:Request,res:Response,next:NextFunction) => {

    try {
        const {orderId} = req.params;
        const order = await Order.findById(orderId).populate("ticket");

        if(!order) throw new NotFoundError();
        
        if(order?.userId !== req.currentUser!.id) throw new UnauthorizedError();

        res.send(order);
    }

    catch(err)
    {
        next(err)
    }
    

})

export {router as getOrder}