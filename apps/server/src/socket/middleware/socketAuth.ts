// auth socket middleware 


import type {Socket} from "socket.io";
import {createClerkClient} from "@clerk/express";
import {prisma} from "../../lib/prisma";


const clerk = createClerkClient({secretKey : process.env.CLERK_SECRET_KEY});


export async function  socketAuthMiddleware(
    socket : Socket, next : (err? : Error) => void
)  : Promise<void> {

    try {
        const token = (socket.handshake.auth as {token? : string}).token;

        if(!token) return next(new Error("AUTH_MISSING"));
        
        
        const payload = await clerk.verifyToken(token);
        const clerkId = payload.sub;


        const user = await prisma.user.findUnique({
           where : {clerkId},
           select : {id : true, clerkId : true, username : true, displayName : true, avatarUrl : true},
        });


        if(!user) return next(new Error("USER_NOT_FOUND"));


        (socket as any).dbUser = user;

        next();


   }
     catch {
        next(new Error("AUTH_INVALID"));
     }
}



