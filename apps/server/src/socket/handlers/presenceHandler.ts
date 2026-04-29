import type { Server, Socket } from "socket.io";
import { getLiveRoom, updateUserStatus, updateUserPing, setKickInterval } from "../../lib/roomState";
import {KICK_CHECK_INTERVAL_MS, WARN_BEFORE_KICK, IDLE_AFTER_MS, getSecondsUntilKick} from "../../services/presence.service";

import {kickUser} from "./roomHandler";


 

const kickWatchers = new Map<string, ReturnType<typeof setInterval>>();

export function startKickWatcher(io : Server, roomId : string) : void {
    
     if(kickWatchers.has(roomId)) return;

     const interval = setInterval(async () => {

        const liveRoom = getLiveRoom(roomId);

        if(!liveRoom) {stopKickWatcher(roomId); return;}


        const now = Date.now();

        const kickThresholdMs = liveRoom.kickAfterSecs * 1000;

        const warnTheresholdMs = kickThresholdMs - WARN_BEFORE_KICK;


        // transition to idle  

        for(const user of liveRoom.users.values()) {

          const silent = now - user.lastPingAt;

          // transition to idle  

          if(silent >= IDLE_AFTER_MS && user.status === "active") {
             updateUserStatus(roomId, user.userId, "idle");

             io.to(roomId).emit("presence:update", {
                userId : user.userId,
                status : "idle",
                lastActiveAt : user.lastActiveAt,
             });
          }



          // warning before kick  

          if(silent >= warnTheresholdMs && silent < kickThresholdMs) {
              const  secondsLeft = getSecondsUntilKick(user, liveRoom.kickAfterSecs);
              
              io.to(user.socketId).emit("kick:warning", {secondsLeft});
          }


          // kick the user 

          if(silent >= kickThresholdMs) {
             updateUserStatus(roomId, user.userId, "inactive");
             await kickUser(io, roomId, user.userId);
          }
        }
     }, KICK_CHECK_INTERVAL_MS);



     kickWatchers.set(roomId, interval);
     setKickInterval(roomId, interval);
}




// function for stop kick watcher 

export function stopKickWatcher(roomId : string):  void {

     const interval = kickWatchers.get(roomId);
     if(interval) {
        clearInterval(interval);
        kickWatchers.delete(roomId);
     }

}


// presence ping handle  

export function handlePresencePing(socket : Socket, roomId : string) : void {
    const dbUser = (socket as any).dbUser;

    updateUserPing(roomId, dbUser.id);
}



export function handlePresenceSet(
   io : Server, socket :Socket, roomId : string, status : "active" | "idle" | "inactive",
)  : void {
   
   const dbUser = (socket as any).dbUser;
   updateUserStatus(roomId, dbUser.id, status);



   const liveRoom = getLiveRoom(roomId);

   const user = liveRoom?.users.get(dbUser.id);

   if(!user) return;


   io.to(roomId).emit("presence:update" , {
      userId : dbUser.id,
      status,
      lastActiveAt : user.lastActiveAt,
   });

}





