import express from 'express';
import {body} from 'express-validator';
import { BadRequest } from '../errors/badRequest';
import { ValidateRequest } from '../middlewares/validateRequest';
import { User } from '../models/user';
import { PasswordManager } from '../helper/passwordManager';
import jwt from 'jsonwebtoken';
import { currentUser } from '../middlewares/currentUser';
const router = express.Router();

/*
METHOD : POST
ROUTE: /api/users/signin
DESC: sign in user
*/

router.post('/api/users/signin',
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').trim().notEmpty().withMessage('Password field empty'),
    ValidateRequest,
    currentUser,
    async (req,res) => {

        const {email, password} = req.body;

        // if email doesn't exists => thtrow error
        const user = await User.findOne({email});

        if(!user)
        {
            throw new BadRequest('Invalid Credentials');
        }
    
        // else check if password match
        var isValid = await PasswordManager.isValid(user.password,password);
        if(!isValid)
        {
            throw new BadRequest('Invalid Credentials')
        }
        
        // send cookie
        const token = jwt.sign({
            id: user.id,
            name: user.name,
            email: user.email
        },process.env.JWT_KEY!);

        req.session = {
            jwt: token
        }

        res.status(200).send(user);

})


export {router as signInRouter}