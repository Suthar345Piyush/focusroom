// useRoom hook where user join/leave the room logic part 

'use client';

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getSocket } from "@/lib/socket";
import { useRoomStore } from "@/stores/roomStore";
import { useChatStore } from "@/stores/chatStore";
import { useTimerStore } from "@/stores/timerStore";


 // use Room function 

 export function useRoom(roomId : string) {
   
   const router = useRouter();

   const {user : clerkUser} = useUser();


   const {setRoom, setUsers, setCurrentUserId, addUser, removeUser, updateUserStatus, clearRoom} = useRoomStore();

   const {addMessage, clearMessage} = useChatStore();
   const {sync : syncTimer} = useTimerStore();


   // on mount join room 

   useEffect(() => {
       
       const socket = getSocket();

       if(!socket.connected) return;


       //current user id from clerk 

       if(clerkUser?.id) {
          setCurrentUserId(clerkUser.id);
       }

       // emit a connections 

       socket.emit("room:join", {roomId});


       // incoming events 

       socket.on("room:state", ({room, users}) => {
         setRoom(room);
         setUsers(users);
       });


       socket.on("room:user-joined", ({user}) => {
         addUser(user);
       });


       socket.on("room:user-left", ({userId}) => {
          removeUser(userId);
       });

    

       socket.on("room:user-kicked", ({userId}) => {
         removeUser(userId);

            // if current user is kicked the user will be redirect to the dashboard 

         if(clerkUser?.id === userId) {
            router.replace("/dashboard?kicked=1");
         }
       });


       socket.on("room:closed", ({winnerId}) => {
           router.replace(`/dashboard?winner=${winnerId}&room=${roomId}`);
       });


       // socket for chat message 

       socket.on("chat:message", (msg) => {
         addMessage(msg);
       });




       // timer socket 

       socket.on("timer:sync", (state) => {
          syncTimer(state);
       });

       // status updation and other presence updated

       socket.on("presence-update", ({userId, status, lastActiveAt}) => {
          updateUserStatus(userId, status, lastActiveAt);
       });





       return () => {
          socket.emit("room:leave");
          socket.off("room:state");
          socket.off("room:user-joined");
          socket.off("room:user-left");
          socket.off("room:user-kicked");
          socket.off("room:closed");
          socket.off("chat:message");
          socket.off("timer:sync");
          socket.off("presence-update");

          clearRoom();
          clearMessage();
       }
     
   }, [roomId, clerkUser?.id]);



   // leave room 

   const leaveRoom = useCallback(() => {

     const socket = getSocket();

     socket.emit("room:leave");
     router.replace("/dashboard");
   }, [router]);


   return {leaveRoom};

 }