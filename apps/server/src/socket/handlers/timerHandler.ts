// timer handler function 


import type { Server, Socket } from "socket.io";
import { getLiveRoom, setTimerInterval, clearTimerInterval } from "../../lib/roomState";



// in total three, 1. to start the timer , 2. to pause , 3. to reset the timer 


export function handleTimerStart(io : Server, socket : Socket, roomId : string) : void {

     const dbUser = (socket as any).dbUser;

     const liveRoom = getLiveRoom(roomId);

     if(!liveRoom || dbUser.id !== liveRoom.hostId || liveRoom.timer.isRunning) return;


     liveRoom.timer.isRunning = true;


     // setting the interval 

     const interval  = setInterval(() => {
         
        const room = getLiveRoom(roomId);

        if(!room || !room.timer.isRunning) {
           clearInterval(interval);
           return;
        }


        // remaining seconds left in the timer 

        room.timer.remainingSeconds -= 1;

        if(room.timer.remainingSeconds <= 0) {

           if(room.timer.phase === "focus") {
             room.timer.phase = "break";
             room.timer.remainingSeconds = room.breakMinutes * 60;
           }   
             else {
               room.timer.phase = "focus";
               room.timer.remainingSeconds = room.pomodoroMinutes * 60;
               room.timer.round += 1;
             }
        }


        io.to(roomId).emit("timer:sync", {...room.timer});

     }, 1000);


     setTimerInterval(roomId, interval);
     io.to(roomId).emit("timer:sync", {...liveRoom.timer});     
    
}



// timer pause function 

export function handleTimerPause(io : Server, socket : Socket, roomId : string) : void {

      const dbUser = (socket as any).dbUser;

      const liveRoom = getLiveRoom(roomId);


      if(!liveRoom || dbUser.id !== liveRoom.hostId) return;


      liveRoom.timer.isRunning = false;
      clearTimerInterval(roomId);

      io.to(roomId).emit("timer:sync", {...liveRoom.timer});

}



// timer reset function 


export function handleResetTimer(io : Server, socket : Socket, roomId : string) : void {
      const dbUser = (socket as any).dbUser;

      const liveRoom = getLiveRoom(roomId);

      if(!liveRoom || dbUser.id !== liveRoom.hostId) return;

      clearTimerInterval(roomId);

      liveRoom.timer = {
         phase : "focus",
         remainingSeconds : liveRoom.pomodoroMinutes * 60,
         isRunning : false,
         round : 1,
      }

      io.to(roomId).emit("timer:sync", {...liveRoom.timer});


      
    }


