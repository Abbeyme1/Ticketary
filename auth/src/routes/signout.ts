import express from 'express';

const router = express.Router();

/*
METHOD : POST
ROUTE: /api/users/signout
DESC: signout current user
*/

router.post('/api/users/signout',(req,res) => {

    req.session = null;
    res.send({});
})


export {router as signOutRouter}