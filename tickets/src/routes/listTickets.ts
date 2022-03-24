
import {Request,Response,NextFunction,Router} from "express";
import { Ticket } from "../models/ticket";
const router = Router();

router.get('/api/tickets',async (req:Request,res:Response,next:NextFunction) => {
    const tickets = await Ticket.find({})

    res.status(200).send(tickets);
})



export { router as listTickets}