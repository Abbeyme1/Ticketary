import express,{Request,Response,NextFunction} from "express";
import mongoose from "mongoose";
import {BadRequest, NotFoundError, OrderStatus, requireAuth, ValidateRequest} from "@ticketary/sharedlibrary"
import {body} from "express-validator";
import { Order } from "../models/order";
import { Ticket, ticketDoc } from "../models/ticket";
import { orderCreatedPublisher } from "../events/publishers/orderCreatedPublisher";
import { connectNATS } from "../connectNATS";

const router = express.Router();
const EXPIRY_WINDOW_DUR = 1;

router.post("/api/orders",
requireAuth,
body("ticketId").not().isEmpty()
.custom((val:string) => mongoose.Types.ObjectId.isValid(val)).withMessage("Ticket ID must be provided"),
ValidateRequest,
async (req:Request,res:Response,next:NextFunction) => {
    

    try {

        const {ticketId} = req.body;

        // find ticket
        
        let ticket = await Ticket.findById(ticketId);

        // throw not found error if there is no ticket with specified ticket id
        if(!ticket) throw new NotFoundError();

        // check if its already reserved
        let isReserved = await ticket.isReserved();

        // throw error if already reserved
        if(isReserved) throw new BadRequest("Ticket already reserved");

        // create expiry time of an order
        var expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + EXPIRY_WINDOW_DUR);

        const order = Order.build({
            userId: req.currentUser!.id,
            status : OrderStatus.Created,
            expiresAt: expiry,
            ticket: ticket
        })

        await order.save();

        //emit event of orderCreated

        new orderCreatedPublisher(connectNATS.client).publish({
            id: order.id,
            userId: order.userId,
            status: order.status,
            version: order.version,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: ticket.id,
                price: ticket.price
            }
        })


        res.status(201).send(order)

    }
    catch(err)
    {
        next(err)
    }

})


export {router as createOrder}