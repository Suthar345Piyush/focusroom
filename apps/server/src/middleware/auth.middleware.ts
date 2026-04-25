// express auth middleware 

import {clerkMiddleware, getAuth} from "@clerk/express";
import type { Response, NextFunction } from "express";
import type  {AuthedRequest} from "../types";
import {prisma} from "../lib/prisma";



export const requireAuth = clerkMiddleware();


export async function attachDbUser(
    req : AuthedRequest,
    res : Response,
    next : NextFunction,
) : Promise<void> {

    try {

       const auth = getAuth(req);

       if(!auth.userId) {
         res.status(401).json({error : "Unauthorized"});
         return;
       }


       req.auth = {userId : auth.userId};



       // getting the user data prisma singleton client 

       const user = await prisma.user.findUnique({
           where : {clerkId : auth.userId},
           select : {id : true, clerkId : true,  username : true, displayName : true, avatarUrl : true}
       });

       if(!user) {
          res.status(404).json({error : "User profile not found. Please complete the setup."});
       }

       req.dbUser = user;


       // calling next middleware 

       next();

    } catch (err){
       next(err);
       
    }
   
}





