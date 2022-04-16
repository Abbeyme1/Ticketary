
import {Request,Response,NextFunction,Router} from 'express'
import { NotFoundError, RequestValidationError, requireAuth, UnauthorizedError, ValidateRequest } from '@ticketary/sharedlibrary'
import { Ticket } from '../models/ticket'
import { body ,validationResult} from 'express-validator'
import { ticketUpdatedPublisher } from '../event/publishers/ticketUpdatedPubisher'
import { connectNATS } from '../connectNATS'


const router = Router()


router.put('/api/tickets/:id',
requireAuth,
body('title').not().isEmpty().withMessage('Title is required'),
body('price').isFloat({gt: 0}).withMessage('Price should be greater than 0'),
ValidateRequest,
async (req:Request,res:Response,next:NextFunction) => {

    const {title,price} = req.body;
    const {id} = req.params;
    try {

        const ticket = await Ticket.findById(id);
        if(ticket == null) throw new NotFoundError();

        if(ticket.userId !== req.currentUser!.id) throw new UnauthorizedError()

        ticket.set({
            title,price
        })

        await ticket.save()

        new ticketUpdatedPublisher(connectNATS.client).publish({
            title: ticket.title,
            price: ticket.price,
            id: ticket.id,
            userId: ticket.id
        })

        res.send(ticket)
    }
    catch(err)
    {
        next(err)
    }
})



export {router as updateTicket}