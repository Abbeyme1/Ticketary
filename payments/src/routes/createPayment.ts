
import { BadRequest, NotFoundError, OrderStatus, requireAuth, UnauthorizedError, ValidateRequest } from "@ticketary/sharedlibrary";
import express,{Request,Response,NextFunction} from "express"
import { body } from "express-validator";
import { connectNATS } from "../connectNATS";
import { paymentCreatedPublisher } from "../events/publishers/paymentCreatedPublisher";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { stripe } from "../stripe";

const router = express.Router();


router.post("/api/payments",
requireAuth,
body("orderId").not().isEmpty().withMessage("orderId is required"),
body("token").not().isEmpty().withMessage("Token is required"),
ValidateRequest
,async (req:Request,res:Response,next:NextFunction) => {

    try {
        const {orderId,token} = req.body;

        const order = await Order.findById(orderId);

        if(!order) throw new NotFoundError();

        if(order.userId !== req.currentUser!.id) throw new UnauthorizedError();

        if(order.status === OrderStatus.Cancelled) throw new BadRequest("Cannot pay for a cancelled order");

        // create payment now

        const charge = await stripe.charges.create({
            amount: order.price * 100,
            currency: "usd",
            source: token,
            description: `payment for order id : ${order.id}`
        }).catch((err) => {
            throw new Error(err);
        })

        const payment = Payment.build({
            orderId: order.id,
            paymentId: charge.id
        })

        await payment.save();

        // publish a new event of payment made
        new paymentCreatedPublisher(connectNATS.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            paymentId: payment.paymentId
        })

        res.status(201).send({id: payment.id})

    }
    catch(err)
    {
        next(err)
    }
    

})

export {router as createPayment}