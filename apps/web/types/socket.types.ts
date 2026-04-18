import type { RoomUser, UserStatus } from "./user.types";
import type {Room, TimerState} from "./room.types";


// events from user to server  

export interface ClientToServerEvents {
    "room:join" : (payload : {roomId : string; inviteCode?: string}) => void;
    "room:leave" : () => void;
    "chat:send" : (payload : {message: string}) => void;
    "presence:ping" : () => void;
    "presence:set" : (payload : {status: UserStatus}) => void;
    "timer:start" : () => void;
    "timer:pause" : () => void;
    "timer:reset" : () => void;
}


// events from server to user 

export interface ServerToClientEvents {
    "room:state": (payload : {room : Room; users: RoomUser[]}) => void;
    "room:user-joined" : (payload : {user: RoomUser}) => void;
    "room:user-left" : (payload : {userId: string}) => void;
    "room:user-kicked": (payload : {userId : string; reason: "inactive"}) => void;
    "room:closed" : (payload : {winnerId : string}) => void;
    "chat:message" : (payload : ChatMessage) => void;
    "timer:sync" : (payload : TimerState) => void;
    "presence-update" : (payload : {
       userId : string;
       status : UserStatus;
       lastActiveAt : string;
    }) => void;

    "kick-warning" : (payload : {secondsLeft: number}) => void;

    error : (payload : {code : string; message: string }) => void;
}


export interface ChatMessage {
   id: string;
   userId: string;
   username : string;
   displayName : string;
   avatarUrl? : string;
   message: string;
   sentAt : string;
}



