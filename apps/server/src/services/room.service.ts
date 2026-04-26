// room service 

import { prisma } from "../lib/prisma";
import {nanoid} from "nanoid";



// one main parent room service function 

export const roomService = {
  
    // create room

    async create(data : {
       hostId : string;
       name : string;
       pomodoroMinutes : number;
       breakMinutes : number;
       kickAfterSecs : number;
       maxUsers : number;
    }) {

        const inviteCode = nanoid(8).toUpperCase();

        return prisma.room.create({data : {...data, inviteCode}});
    },


    // find room by id  

    async findById(id : string) {
       return prisma.room.findUnique({where : {id}});
    },



    // find using invite code 


    async findByInviteCode(inviteCode : string) {
       return prisma.room.findUnique({where : {inviteCode}});
    },


    // listing the active rooms, for user to join
    
    async listActive() {
       return prisma.room.findMany({
         where : {status : {in : ["WAITING", "ACTIVE"]}},
         orderBy : {createdAt : "desc"},
         take : 50,
       });
    },



    // set status function 

    async setStatus(id : string, status : "WAITING" | "ACTIVE" | "CLOSED") {
        
       return prisma.room.update({
         where : {id},
         data : {
           status,
           ...(status === "CLOSED" ? {closedAt : new Date()} : {}),
         }  
       });
    },


    // creatin a session (using upsert - update , create and where)

    async createSession(roomId : string, userId : string) {
        return prisma.roomSession.upsert({
           where : {roomId_userId : {roomId, userId}},
           update : {joinedAt : new Date(), leftAt : null},
           create : {userId, roomId},
        });
    },


    // close session  

    async closeSession(roomId : string, userId : string) {
        return prisma.roomSession.updateMany({
           where : {roomId, userId, leftAt : null},
           data : {leftAt : new Date()},
        });
    },


    // winner marking  

    async markWinner(roomId : string, userId : string) {
       return prisma.roomSession.updateMany({
          where : {roomId, userId},
          data : {isWinner : true},
       });
    },



    // counting the current active sessions  

    async countActiveSessions(roomId : string) {
       return prisma.roomSession.count({where : {roomId, leftAt : null}});
    },



    // getting the active sessions   

    async getActiveSessions(roomId : string) {
       return prisma.roomSession.findMany({

         where : {roomId, leftAt : null},
         include : {user : {select : {id : true, username : true, displayName : true, avatarUrl : true}}}

       })
    }

}


