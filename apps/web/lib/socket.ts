// socket primitives 

import {io, type Socket} from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@/types/socket.types";


export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;


let socket : AppSocket | null = null;


const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:4000";


// calling initSocket(token) once on app mount after clerk authentication 

export function getSocket() : AppSocket {
     if(!socket) {
        socket = io(WS_URL, {
           autoConnect : false,
           transports : ["websocket"],
        }) as AppSocket;
     }
     return socket;
}


// socket initializing function 


export function initSocket(token : string) : AppSocket {
   const s = getSocket();

   s.auth = {token};

   if(!s.connected) {
     s.connect();
   }

   return s;


}


// disconnection  of socket 

export function destroySocket() {
    if(socket) {
       socket.disconnect();
       socket = null;
    }
}







