// validate middleware 

import type { Request, Response, NextFunction } from "express";
import {z, ZodError} from "zod";


export function validate(schema : z.ZodType) {
    
    return (req : Request, res : Response, next : NextFunction) : void => {
        
       try {

          req.body = schema.parse(req.body);

          next();

       } catch (err) {

           if(err instanceof ZodError) {
             res.status(400).json({

                error : "Validation failed",
                issues : err.errors.map((e : any) => ({

                   field : e.path.join("."),

                   message  : e.message,

                }))
             });
             return;

           }
           next(err);
       }


    }
    
   
}




