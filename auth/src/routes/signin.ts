import express from 'express';

const router = express.Router();

/*
METHOD : POST
ROUTE: /api/users/signin
DESC: sign in user
*/

router.post('/api/users/signin',(req,res) => {
    res.send('Hi there');
})


export {router as signInRouter}