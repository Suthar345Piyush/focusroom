// types for server side 

export type UserStatus = "active" | "idle" | "inactive";
export type RoomStatus = "WAITING" | "ACTIVE" | "CLOSED";
export type PomodoroPhase = "focus" | "break";


export interface TimerState {
    phase : PomodoroPhase;
    remainingSeconds : number;
    isRunning : boolean;
    round : number;
}



import type { Request } from "express";

export interface AuthedRequest extends Request {
    auth : {
       userId : string;
    };

    dbUser?: {
       id : string;
       clerkId : string;
       username : string;
       displayName : string;
       avatarUrl : string | null;
    }
}

