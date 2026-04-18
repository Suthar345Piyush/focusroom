import type { RoomUser } from "./user.types";

export type RoomStatus = "WAITING" | "ACTIVE" | "CLOSED";

export interface Room {
   id: string;
   inviteCode : string;
   hostId : string;
   name : string;
   pomodoroMinutes : number;
   breakMinutes : number;
   kickAfterSecs : number;
   maxUsers : number;
   status : RoomStatus;
   createdAt : string;
   closedAt?: string;
}

export interface RoomState {
   room : Room;
   users : RoomUser[];
   currentUserId : string;
}


export type PomodoroPhase = "focus" | "break";

export interface TimerState {
  phase : PomodoroPhase;
  remainingSeconds : number;
  isRunning : boolean;
  round : number;
}


export interface CreateRoomPayload {
   name: string;
   pomodoroMinutes: number;
   breakMinutes : number;
   kickAfterSecs : number;
   maxUsers : number;
}





