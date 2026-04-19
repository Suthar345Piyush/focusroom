// authentication API 

import { useAuth } from "@clerk/nextjs";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";


// common class for api related error, can use it anywhere in code to return error in a structured format   

class ApiError extends Error {
   constructor(
     public status: number,
     message: string,
     public data? : unknown
   ) {
     super(message);
     this.name = "ApiError";
   }
}



async function request<T>(
    path : string,
    options : RequestInit & {token?: string} = {}
) : Promise<T> {

  const {token, ...init} = options;
   

  const headers: HeadersInit = {
     "Content-type" : "application/json",
    ...(token ? {Authorization: `Bearer ${token}`} : {}),
    ...((init.headers as Record<string, string>) ?? {}),
  };


  const res = await fetch(`${BASE_URL}${path}`, {...init, headers});


  if(!res.ok) {
     const error = await res.json().catch(() => ({message : res.statusText}));
     
     throw new ApiError(res.status, error.message ?? "Request failed", error);
  }

  return res.json() as Promise<T>;
}



// api surfaces 


import type { Room, CreateRoomPayload } from "@/types/room.types";
import type { User, LeaderboardEntry } from "@/types/user.types";
import type { ProfileInput } from "./validators/profile.schema";



export const api = {

    rooms : {
       create : (token: string, data : CreateRoomPayload) => request<Room>("/rooms", {method : "POST", body : JSON.stringify(data), token}),


       get: (token : string, roomId : string) => request<Room>(`/rooms/${roomId}`, {token}),

       join : (token : string, inviteCode: string) => request<Room>(`/rooms/join/${inviteCode}`, {method : "POST", token}),



       list : (token : string) => request<Room[]>("/rooms", {token}),

       users : {
          me : (token : string) => request<User>("/users/me", {token}),


          updateProfile : (token : string, data : ProfileInput) => request<User>("/users/me", {method : "PATCH" , body : JSON.stringify(data), token}),

          getById : (token : string, userId : string) => request<User>(`/users/${userId}`, {token}),
       },


       leaderboard : {
          global : (token : string, limit = 50) => request<LeaderboardEntry[]>(`/leaderboard?limit=${limit}`, {token}),


          room : (token : string, roomId : string) => request<LeaderboardEntry[]>(`/leaderboard/room/${roomId}`, {token}),
       },
    }
  };


  // useAuth clerk hook to get clerk token with api methods 


  export function useApi() {
      const {getToken} = useAuth();


      async function withToken<T>(
         fn : (token : string) => Promise<T> ) : Promise<T> {
            const token = await getToken();

            if(!token) throw new ApiError(401, "Not authenticated");

            return fn(token);
         }
         return {withToken, api};
  }


  






