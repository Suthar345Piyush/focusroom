// having all the handlers in this file  
// initialization of the socket 


import type {Server as HttpServer} from "http";
import { Server } from "socket.io";
import { socketAuthMiddleware } from "./middleware/socketAuth";
import {handleRoomJoin, handleRoomLeave, handleDisconnect} from "./handlers/roomHandler";
import { handlePresencePing, handlePresenceSet } from "./handlers/presenceHandler";
import {handleTimerStart, handleTimerPause, handleResetTimer} from "./handlers/timerHandler";
import {handleChatMessage} from "./handlers/chatHandler";



export function initSocket(httpServer : HttpServer) : Server {
     
   const   io = new Server(httpServer, {
       
      cors : {
          origin : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
          methods : ["GET", "POST"],
          credentials : true,
      },

      transports : ["websocket"],
      pingTimeout : 20_000,
      pingInterval : 10_000,
     });



      io.use(socketAuthMiddleware);


   // socket connection 

      io.on("connection", (socket) => {

          const dbUser = (socket as any).dbUser;

          console.info(`[ws] + ${dbUser.usename} (${socket.id})`);


          const roomId = () => [...socket.rooms].find((r) => r !== socket.id);


          // room join socket 

          socket.on("room:join", (p) => handleRoomJoin(io, socket, p).catch(console.error));

          //room leave socket 

          socket.on("room:leave", () => handleRoomLeave(io, socket).catch(console.error));

          // presence ping socket 

          socket.on("presence:ping", () => {const r = roomId(); if(r) handlePresencePing(socket, r); });


          // presence set 

          socket.on("presence:set", (p) => {const r = roomId(); if (r) handlePresenceSet(io, socket, r, p.status); });

          // timer start socket

          socket.on("timer:start", () => {const r = roomId(); if(r) handleTimerStart(io, socket, r); });

          // timer pause socket

          socket.on("timer:pause", () => {const r = roomId(); if (r) handleTimerPause(io, socket,r); });

          // timer reset

          socket.on("timer:reset", () => {const r = roomId(); if (r) handleResetTimer(io, socket, r);});

          // chat sent socket 

          socket.on("chat-send", (p) => {const r = roomId(); if (r) handleChatMessage(io, socket, r, p)});



          // socket disconnection 


          socket.on("disconnect", (reason) => {
             console.info(`[ws] - ${dbUser.username} (${reason})`);
             handleDisconnect(io, socket).catch(console.error);
          });

      });

  return io;

}


