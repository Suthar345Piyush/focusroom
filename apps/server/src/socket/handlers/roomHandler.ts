// room handler function 


import { Server, Socket } from "socket.io";
import {roomService} from "../../services/room.service";
import {leaderboardService} from "../../services/leaderboard.service";
import { createLiveRoom, getLiveRoom, deleteLiveRoom, addUserToRoom, removeUserFromRoom, serializeLiveUsers } from "../../lib/roomState";
import { startKickWatcher, stopKickWatcher } from "./presenceHandler";

import type { LiveUser } from "../../lib/roomState";



// handle room join function 

export async function handleRoomJoin(io : Server, socket : Socket, payload : {roomId : string} ): Promise<void> {

     const dbUser = (socket as any).dbUser;

     const {roomId} = payload;

     const dbRoom = await roomService.findById(roomId);

     if(!dbRoom || dbRoom.status === "CLOSED") {
       socket.emit("error", {code : "ROOM_NOT_FOUND", message : "Room not found or closed"});
     return;
      }



      let liveRoom = getLiveRoom(roomId);

      // if live room is not present then do create room 

      if(!liveRoom) {
         liveRoom = createLiveRoom(
            roomId, dbRoom.hostId, dbRoom.pomodoroMinutes, dbRoom.kickAfterSecs, dbRoom.breakMinutes,
         );
      }


      // checking for space in the live room, if it exceeded the max user's limit then we will send's an error  

      if(liveRoom.users.size >= dbRoom.maxUsers) {
         socket.emit("error", {code : "ROOM_FULL", message : "Room is full"});
         return;
      }


      await roomService.createSession(roomId, dbUser.id);
      
      if(dbRoom.status === "WAITING") await roomService.setStatus(roomId, "ACTIVE");




      // creating live user 

      const liveUser : LiveUser = {
         
       userId : dbUser.id,
       socketId : socket.id,
       username : dbUser.username,
       displayName : dbUser.displayName,
       avatarUrl : dbUser.avatarUrl ?? undefined,
       isHost : dbUser.id === dbRoom.hostId,
       status : "active",
       joinedAt : new Date().toISOString(),
       lastActiveAt : new Date().toISOString(),
       lastPingAt : Date.now(),

      };


       // adding user to the room 

       addUserToRoom(roomId, liveUser);
       await socket.join(roomId);

       socket.emit("room:state", {
         room : dbRoom,
         users : serializeLiveUsers(liveRoom),
       });


       socket.to(roomId).emit("room:user-joined", {

          user : {...liveUser, socketId : undefined, lastPingAt : undefined},
       });


       startKickWatcher(io, roomId);

}



export async function handleRoomLeave(io : Server, socket : Socket) : Promise<void> {
    
    const dbUser = (socket as any).dbUser;
    const roomId = [...socket.rooms].find((r) => r !== socket.id);

    if(!roomId) return;
    await _removeUser(io, socket, roomId, dbUser.id);
}



// disconnect function 

export async function handleDisconnect(io : Server, socket : Socket) : Promise<void> {
     
     const dbUser = (socket as any).dbUser;

     const roomId = [...socket.rooms].find((r) => r !== socket.id);

     if(!roomId) return;

     await _removeUser(io, socket, roomId, dbUser.id);
}



// remove user function 

async function _removeUser(io : Server, socket : Socket, roomId : string, userId : string) : Promise<void> {
     
   const liveRoom = getLiveRoom(roomId);

   if(!liveRoom) return;

   removeUserFromRoom(roomId, userId);

   await roomService.closeSession(roomId, userId);

   socket.leave(roomId);

   io.to(roomId).emit("room:user-left", {userId});


   const remaining = [...liveRoom.users.values()];

   if(remaining.length === 1) {
      await _closeRoom(io, roomId, remaining[0].userId, liveRoom.pomodoroMinutes);
   }  else if (remaining.length === 0) {
      stopKickWatcher(roomId);
      deleteLiveRoom(roomId);


      await roomService.setStatus(roomId, "CLOSED");
   }
}


// kick user function 

export async function kickUser(io : Server, roomId : string, userId : string) : Promise<void> {


     const liveRoom = getLiveRoom(roomId);

     if(!liveRoom) return;

     const user = liveRoom.users.get(userId);

     if(!user) return;

     removeUserFromRoom(roomId, userId);

     await roomService.closeSession(roomId, userId);

     io.to(user.socketId).emit("room:user-kicked", {userId , reason : "inactive"});

     const kickedSocket = io.sockets.sockets.get(user.socketId);

     kickedSocket?.leave(roomId);


     io.to(roomId).emit("room:user-left", {userId});


     const remaining = [...liveRoom.users.values()];

     if(remaining.length === 1) {

        await _closeRoom(io, roomId, remaining[0].userId, liveRoom.pomodoroMinutes);

     }  else if(remaining.length === 0) {
        stopKickWatcher(roomId);
        deleteLiveRoom(roomId);

        await roomService.setStatus(roomId, "CLOSED");
     }
}



async function _closeRoom(io : Server, roomId : string, winnerId: string, pomodoroMinutes : number) : Promise<void> {
    
   const liveRoom = getLiveRoom(roomId);

   const participants = liveRoom ? [...liveRoom.users.values()].map((u) => ({userId : u.userId, joinedAt : u.joinedAt})) : [];


   await leaderboardService.recordRoomResult(roomId, pomodoroMinutes, winnerId, participants);

   await roomService.markWinner(roomId, winnerId);

   await roomService.setStatus(roomId, "CLOSED");

   io.to(roomId).emit("room:closed", {winnerId});


   stopKickWatcher(roomId);
   deleteLiveRoom(roomId);
}








