import express,{Request,Response} from 'express';
import { body, validationResult } from 'express-validator';
import { BadRequest } from '../errors/badRequest';
import { DatabaseConnectionError } from '../errors/databaseConnectionError';
import { RequestValidationError } from '../errors/requestValidationError';
import { User } from '../models/user';
import jwt from "jsonwebtoken";

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
        
        const {name,email,password} = req.body;

        const existsUser = await User.findOne({email});

        if(existsUser)
        {
            throw new BadRequest('Email already exits');
        }

        const user = User.build({name,email,password});
        await user.save();

        var token = jwt.sign({
            id: user.id,
            email: user.email
        },'abd');

        req.session = {
            jwt: token
        }
        res.status(201).send(user)

})

export {router as signUpRouter}