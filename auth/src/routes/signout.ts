import express from 'express';

const router = express.Router();

/*
METHOD : POST
ROUTE: /api/users/signout
DESC: signout current user
*/

router.post('/api/users/signout',(req,res) => {
    res.send('Hi there');
})


export {router as signOutRouter}