import express from 'express';

const router = express.Router();

/*
METHOD : GET
ROUTE: /api/users/currentuser
DESC: get current user's info
*/

router.get('/api/users/currentuser',(req,res) => {
    res.send('Hi there');
})


export {router as currentUserRouter}