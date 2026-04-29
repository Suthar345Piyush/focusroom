// room controller 


import type { Response, NextFunction } from "express";
import {roomService} from "../services/room.service";
import type { AuthedRequest } from "../types";



export const roomController =  {

    // creation 

    async create(req : AuthedRequest, res : Response, next : NextFunction) {

        try {
            
          const room = await roomService.create({hostId : req.dbUser!.id, ...req.body});
          res.status(201).json(room);

        } catch (err) {
            next(err);
        }
    },


    // list of room 

    async  list(req : AuthedRequest, res : Response, next : NextFunction) {

        try {
          const rooms = await roomService.listActive();      
          res.json(rooms);
        }  catch (err) {
            next(err);
        }
    },


    //  joining room by invite code 

    async joinByInviteCode(req : AuthedRequest, res : Response, next : NextFunction) {

        try {

          const room = await roomService.findByInviteCode(req.params.inviteCode);

          if(!room) {
             res.status(404).json({error : "Invalid or expired invite code"});
             return;
          }


          if(room.status === "CLOSED") {
             res.status(410).json({error : "This room is alreay closed"});
             return;
          }

          // getting the active sessions (user's in the room)

          const count = await roomService.countActiveSessions(room.id);

          if(count >= room.maxUsers) {
             res.status(403).json({error : "Room is full"});
             return;
          }

          res.json(room);
            
          

        } catch(err) {
            next(err);
        }


    },




    //  getting room by id 

    async getRoomById(req : AuthedRequest, res : Response, next : NextFunction) {
        try {
             
          const room = await roomService.findById(req.params.id);

          if(!room)  {
             res.status(404).json({error : "Room not found"});
             return;
          }

          res.json(room);
        } catch(err) {
            next(err);
        }
    }

}