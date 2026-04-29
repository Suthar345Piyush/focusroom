// user controller - getting user and some crud on the user 

import { Response, NextFunction } from "express";
import type {AuthedRequest} from "../types";
import {userService} from "../services/user.service";


export const userController = {

   // getting the user from db

   async getMe(req: AuthedRequest, res : Response, next : NextFunction) {
       try {
          res.json(req.dbUser);
       } catch (err){
           next(err);
       }
   },


   // update the user 

   async updateMe(req : AuthedRequest, res : Response, next : NextFunction) {

      try {
        const updated = await userService.updateProfile(req.dbUser!.id, req.body);
        res.json(updated);     
        } catch(err){
            next(err);
        }
   },


   // (user) get by id

   async getById(req : AuthedRequest, res : Response, next : NextFunction) {

       try {

          const user = await userService.findById(req.params.id);

          if(!user){
            res.status(404).json({error : "User not found"}); 
            return;
          }


       } catch(err){
          next(err);
       }
   },


 // clerk based crud 

 // user creation 

 async sync(req : AuthedRequest, res : Response, next : NextFunction) {
    try {

        const user  = await userService.upsertFromClerk(req.body);
        res.status(201).json(user);

    } catch (err){

       next(err);

    }
 },


  
  // user update 

  async syncUpdate(req : AuthedRequest, res : Response, next : NextFunction) {
      try {
           const user = await userService.upsertFromClerk(req.body);
           res.json(user);
      } catch (err) {
         next(err);
      }
  },




  // user deletion 
  
  async deleteUser(req : AuthedRequest, res : Response, next : NextFunction) {

     try {
        const user = await userService.deleteByClerkId(req.params.clerkId);
        res.status(204).json(user);

     } catch (err) {

        next(err);
     }
     
  }
}