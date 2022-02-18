import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken';


interface userDetails {
    name: string,
    id: string,
    email: string
}

declare global {
    namespace Express {
      interface Request {
        currentUser?: userDetails
      }
    }
}

export const currentUser = (req: Request,res: Response,next: NextFunction) => {

    // if it doesnt have token
    if(!req.session?.jwt) {return next();}
    
    // else
    try {
        var userDetails = jwt.verify(req.session.jwt,process.env.JWT_KEY!) as userDetails;  
        
        // if it is valid add it to req.currentUser
        req.currentUser = userDetails
    }
    catch(err){}
    
    next();

}