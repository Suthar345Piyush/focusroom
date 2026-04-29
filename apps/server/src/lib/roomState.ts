// state of the room sync with socket, live users and live room sync code --------------


import type {TimerState, PomodoroPhase} from "../../../../packages/shared/types";


// joined live user types   
export interface LiveUser {
    userId : string;
    socketId : string;
    username : string;
    displayName : string;
    avatarUrl?: string;
    isHost : boolean;
    status : "active" | "idle" | "inactive";
    joinedAt : string;
    lastActiveAt : string;
    lastPingAt : number;         // in ms 
}


// live room types  

export interface LiveRoom { 
   roomId : string;
   hostId : string;
   kickAfterSecs : number;
   pomodoroMinutes : number;
   breakMinutes : number;
   users : Map<string, LiveUser>;
   timer : TimerState;
   timerInterval?: ReturnType<typeof setInterval>;
   kickInterval? : ReturnType<typeof setInterval>;
} 


// roomId => live room 

const rooms = new Map<string, LiveRoom>();

// socket id -> room id for easy kickout 

const socketRoom = new Map<string, string>();



// crud on room


// creating the live room 

export function createLiveRoom(
      roomId : string, hostId : string, pomodoroMinutes : number, kickAfterSecs : number, breakMinutes : number,
) : LiveRoom {
    
   const room : LiveRoom = {

      roomId,
      hostId,
      pomodoroMinutes,
      kickAfterSecs,
      breakMinutes,

      users : new Map(),
      timer : {
         phase : "focus",
         remainingSeconds : pomodoroMinutes * 60,
         isRunning : false,
         round : 1,
      },
   };

   rooms.set(roomId, room);

      return room;
   
}



//read operation on live room - get 

export function getLiveRoom(roomId : string) : LiveRoom | any {
      return rooms.get(roomId);
}


// delete on live room , clearing timer and kick out intervals when deleting the room 

export function deleteLiveRoom(roomId : string) : void {
   
   const room = rooms.get(roomId);

   if(room) {
      if(room.timerInterval) clearInterval(room.timerInterval);
      if(room.kickInterval)  clearInterval(room.kickInterval);
   }

   rooms.delete(roomId);

}


/*
  setting up the user presence 

  adding user to room 
  remove user from room
  getting room by socket id 
  getting user by socket id  
  updating user status  
  updating user ping  (when user was active last time)

*/



// 1. adding user to the room 

export function  addUserToRoom(roomId : string, user : LiveUser) : void {
    
    const room = rooms.get(roomId);

    if(!room) return;

    room.users.set(user.userId, user);
    socketRoom.set(user.socketId, roomId);
}


// 2. removing user from the room 

export function removeUserFromRoom(roomId : string, userId : string) : void {
    
    const room = rooms.get(roomId);

    if(!room) return;

    const user = room.users.get(userId);
    if(user) socketRoom.delete(user.socketId);

    room.users.delete(userId);

}



// 3. getting room using socket id, it returns room 

export function getRoomBySocketId(socketId : string) : LiveRoom | undefined {
     const roomId = socketRoom.get(socketId);

     return roomId ? rooms.get(roomId) : undefined;

}


// 4. getting user using socket id, it will return  the user 

export function getUserBySocketId(socketId : string) : LiveUser | undefined {
    
   const room = getRoomBySocketId(socketId);

   if(!room) return undefined;

   return [...room.users.values()].find((u) => u.socketId === socketId);

}


// 5. updating the user status  

export function updateUserStatus (
    roomId : string, userId : string, status : LiveUser["status"]
) : void {
   
    const room = rooms.get(roomId);

    if(!room) return;

    const user = room.users.get(userId);

    if(!user) return;

    user.status = status;
    user.lastActiveAt = new Date().toISOString();

    if(status === "active") user.lastPingAt = Date.now();
}



// 6. updating the user ping (when user last active), setting current time as their last active time 


export function updateUserPing(roomId : string, userId : string) : void {
    
   const room = rooms.get(roomId);

   if(!room) return;

   const user = room.users.get(userId);
   if(!user) return;

   user.lastPingAt = Date.now();
   user.lastActiveAt = new Date().toISOString();

   user.status =  "active";
}



// timer configuration like timer interval, kick interval along with their clear 

export function setTimerInterval (

    roomId : string, interval : ReturnType<typeof setInterval>

) : void {
    
     const room = rooms.get(roomId);

     if(!room) return;
     if(room.timerInterval)  clearInterval(room.timerInterval);

     room.timerInterval = interval;
}



// clear interval (timer)

export function clearTimerInterval(roomId : string) : void {
   
   const room = rooms.get(roomId);
   if(!room) return;

   if(room.timerInterval)  clearInterval(room.timerInterval);

   room.timerInterval = undefined;
}



// kick interval 

export function setKickInterval(roomId : string, interval : ReturnType<typeof setInterval>) : void {
   
    const room = rooms.get(roomId);
    if(!room) return;

    room.kickInterval = interval;
}



// serializing all live users when socket emits 

export function serializeLiveUsers(room : LiveRoom) {
  return [...room.users.values()].map(({socketId : _s, lastPingAt: _p, ...rest}) => rest);
}

















