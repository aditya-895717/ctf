import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';
export const verifyToken=(req,res,next) => {
    const tokenjwt =req.cookies.access_token;
    if(!tokenjwt){
        return next(errorHandler(401,'Unauthorized'));
    }
    jwt.verify(tokenjwt,process.env.JWT_SECRET,(err,user)=>{
        if(err){
        return next(errorHandler(401,"Unauthorized"));
        }
        req.user=user
        next();
    })
};