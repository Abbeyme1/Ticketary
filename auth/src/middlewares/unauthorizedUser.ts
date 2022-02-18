import { Request,Response,NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from "../errors/unauthorizedError";

export const unauthorizedUser = (req: Request,res: Response,next: NextFunction) => {

    if(!req.currentUser)
    {
        throw new UnauthorizedError();
    }

    next();
}