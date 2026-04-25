// error middleware 


import type { Request, Response, NextFunction } from "express";


export function errorHandler(
   err : Error,
   _req : Request,
   res : Response,
  _next : NextFunction,
) : void {
   
   console.error("[ERROR]", err.message);


   // prisma error  

   const prismaErr = err as any;

   if(prismaErr.code === "P2002") {
     res.status(409).json({error : "A record with that value already exists."});
     return;
   }

   if(prismaErr.code === "P2025") {
      res.status(404).json({error : "Record not found"});
      return;
   }


   res.status(500).json({
     error : process.env.NODE_ENV === "production"  ? "Internal server error" : err.message,
   });

}