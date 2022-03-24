import { NotFoundError } from "@ticketary/sharedlibrary";
import {Request,Response,Router,NextFunction} from "express"

import { Ticket } from "../models/ticket";

const router = Router();


router.get("/api/tickets/:id", async (req:Request,res:Response,next:NextFunction) => {

    const {id} = req.params;
    
    try {
        const ticket =  await Ticket.findById(id);
       
        if(!ticket) throw new NotFoundError();

        res.status(200).send(ticket)
    }
    catch(err)
    {
        next(err)
    }
    
})

  
export {router as getTicket }