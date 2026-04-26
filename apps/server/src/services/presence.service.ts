// presence service with the auto kick from room tracking , here functions are connected to the presence handler, so that auto kick logic will be in sync with the socket server 

// getting from roomState 

import { getLiveRoom,  updateUserPing, updateUserStatus} from "../lib/roomState";
import type { LiveUser } from "../lib/roomState";


// these all are in ms

export const IDLE_AFTER_MS = 30_000    // 30s no activity idle 
export const KICK_CHECK_INTERVAL_MS =  5_000    // checking in every five seconds 
export const WARN_BEFORE_KICK = 30_000


// now will get the current user action so we can decide, when to kick the user from the room  

export function getUserAction(
    user : LiveUser,
    kickAfterSecs : number
) : "kick" | "warn" | "none" | "idle" {
    
   const silent = Date.now() - user.lastPingAt;

   const kickLimitMs = kickAfterSecs * 1000;
   const warnLimitMs = kickLimitMs - WARN_BEFORE_KICK;
  

   if(silent >= kickLimitMs)  return "kick";
   if(silent >= warnLimitMs && user.status !== "idle") return "warn";
   if(silent >= IDLE_AFTER_MS && user.status === "active") return "idle";

   return "none";

}



// getting the seconds left before the user kicked 

export function getSecondsUntilKick(user : LiveUser, kickAfterSecs : number) : number {
    
   const silent = Date.now() - user.lastPingAt;
   const kickLimitMs = kickAfterSecs * 1000;
   
   return Math.max(0, Math.ceil((kickLimitMs - silent) / 1000));

}


export {updateUserStatus, updateUserPing, getLiveRoom};



