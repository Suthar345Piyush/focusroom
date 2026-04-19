// zustand state for room 


import {create} from "zustand";
import type { Room } from "@/types/room.types";
import type { RoomUser } from "@/types/user.types";

interface RoomStore {
   room : Room | null;
   users : RoomUser[];
   currentUserId : string | null;


   setRoom : (room : Room) => void;
   setUsers : (users: RoomUser[]) => void;
   setCurrentUserId : (id : string) => void;
   addUser : (user : RoomUser) => void;
   removeUser : (userId : string) => void;

   updateUserStatus : (
     userId : string,
     status : RoomUser["status"],
     lastActiveAt : string,
   ) => void;

   clearRoom : () => void;
}


export const useRoomStore = create<RoomStore>((set) => ({

   room : null,
   users : [],
   currentUserId : null,

   setRoom : (room) => set({room}),

   setUsers : (users) => set({users}),

   setCurrentUserId : (id) => set({currentUserId : id}),
   
   addUser : (user) => set((s) => ({
       users : s.users.some((u) => u.id === user.id) ? s.users : [...s.users, user],
   })),

   removeUser : (userId) => set((s) => ({users : s.users.filter((u) => u.id !== userId)})),

   updateUserStatus : (userId, status, lastActiveAt) => set((s) => ({
        users : s.users.map((u) => u.id === userId ? {...u, status, lastActiveAt} : u),
   })),

   clearRoom : () => set({room : null, users : [], currentUserId : null})

}));


// some selection like host, me , is their any host or not, or other user selection  

export const selectHost = (s : RoomStore) => s.users.find((u) => u.id === s.room?.hostId);


export const selectMe = (s : RoomStore) => s.users.find((u) => u.id === s.currentUserId);


export const selectIsHost = (s : RoomStore) => s.currentUserId === s.room?.hostId;

export const selectOtherUsers = (s : RoomStore) => s.users.filter((u) => u.id !== s.currentUserId);














