import express,{Request,Response} from 'express';
import { body, validationResult } from 'express-validator';
import { DatabaseConnectionError } from '../errors/databaseConnectionError';
import { RequestValidationError } from '../errors/requestValidationError';
import { User } from '../models/user';

const router = express.Router();

/*
METHOD : POST
ROUTE: /api/users/signup
DESC: create new account 
*/
router.post('/api/users/signup',
    body('email').isEmail().withMessage("Invalid Email"),
    body('password').trim().isLength({min:7,max:25}).withMessage("Password must be between 7 and 25 characters"),
    async (req: Request,res: Response) => {

        const errors = validationResult(req);

        //Invalid EMAIL or PASSWORD
        if(!errors.isEmpty()) throw new RequestValidationError(errors.array())
        
        const {email,password} = req.body;

        
        throw new DatabaseConnectionError();

        //alraedy in use
        res.send({})
         
        // any other errors

})

export {router as signUpRouter}