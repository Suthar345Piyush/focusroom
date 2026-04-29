// chat socket handlers 

import type {Server, Socket} from "socket.io";
import {getLiveRoom} from "../../lib/roomState";


export function handleChatMessage(
  io : Server, socket : Socket, roomId : string, payload : {message : string}, 
) : void {

     
    const dbUser = (socket as any).dbUser;
    const message = payload.message?.trim?.();

    if(!message || message.length > 500) return;


    const liveRoom = getLiveRoom(roomId);

    if(!liveRoom || !liveRoom.users.has(dbUser.id)) return;


    io.to(roomId).emit("chat:message", {
      id : crypto.randomUUID(),
      userId : dbUser.id,
      username : dbUser.username,
      displayName : dbUser.displayName,
      avatarUrl : dbUser.avatarUrl ?? undefined,
      message,
      sentAt : new Date().toISOString(),
    })
  
}


