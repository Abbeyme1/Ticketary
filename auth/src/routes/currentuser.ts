import express from 'express';
import { currentUser } from '@ticketary/sharedlibrary';

const router = express.Router();

/*
METHOD : GET
ROUTE: /api/users/currentuser
DESC: get current user's info
*/

router.get('/api/users/currentuser',currentUser,(req,res) => {
    res.send({currentUser:  req.currentUser || null});
})


export {router as currentUserRouter}