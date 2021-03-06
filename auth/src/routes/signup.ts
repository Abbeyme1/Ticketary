import express,{Request,Response} from 'express';
import { body } from 'express-validator';
import { BadRequest,ValidateRequest } from '@ticketary/sharedlibrary';
import { User } from '../models/user';
import jwt from "jsonwebtoken";
const router = express.Router();

/*
METHOD : POST
ROUTE: /api/users/signup
DESC: create new account 
*/
router.post('/api/users/signup',
    body('name').trim().isLength({min: 1}).withMessage('Invalid Name'),
    body('email').isEmail().withMessage("Invalid Email"),
    body('password').trim().isLength({min:7,max:25}).withMessage("Password must be between 7 and 25 characters"),
    ValidateRequest,
    async (req: Request,res: Response) => {

        const {name,email,password} = req.body;
        const existsUser = await User.findOne({email});

        if(existsUser)
        {
            throw new BadRequest('Email already exits','email');
        }

        const user = User.build({name,email,password});
        await user.save();  

        var token = jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email
        },
        process.env.JWT_KEY!
        );

        req.session = {
            jwt: token
        }
        res.status(201).send(user)

})

export {router as signUpRouter}