import {Router,Request,Response} from "express";
import {Ticket} from "../models/ticket";
import {body} from "express-validator";
import { requireAuth,ValidateRequest } from "@ticketary/sharedlibrary";
import { ticketCratedPublisher } from "../event/publishers/ticketCreatedPubisher";
import { connectNATS } from "../connectNATS";

const router = Router();


router.post("/api/tickets",
requireAuth,
body('title').not().isEmpty().withMessage('Title is required'),
body('price').isFloat({gt: 0}).withMessage('Price must be greater than 0'),
body('description').not().isEmpty().withMessage('Description is required'),
ValidateRequest,
async (req:Request,res:Response) => {

    const {title,price,description} = req.body;
    
    const ticket = Ticket.build({title, price, description,userId: req.currentUser!.id})
    await ticket.save();

    new ticketCratedPublisher(connectNATS.client).publish({
        title: ticket.title,
        price: ticket.price,
        id: ticket.id,
        userId: ticket.userId,
        version: ticket.version
    });

    res.status(201).send(ticket);

})

export {router as createTicket};

