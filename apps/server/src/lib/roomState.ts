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

export function getLiveRoom(roomId : string) : LiveRoom | undefined {
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

















