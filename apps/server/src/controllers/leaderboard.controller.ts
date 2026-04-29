import type { Response, NextFunction } from "express";
import type { AuthedRequest } from "../types";
import {leaderboardService} from "../services/leaderboard.service";


export const leaderboardController = {
    
     async getGlobal(req : AuthedRequest, res : Response, next : NextFunction) {
        
       try {
          const limit = Math.min(Number(req.query.limit) || 50, 100);
           const entries = await leaderboardService.getGlobal(limit);
           
           res.json(entries);

       }  catch (err){ 
          next(err);
       }
     },


     // for room 

     async getForRoom(req : AuthedRequest, res : Response, next : NextFunction) {
         try {
            const entries = await leaderboardService.getForRoom(req.params.roomId);
         }  catch (err) {
            next(err);
         }
     },
};



