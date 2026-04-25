export type RoomStatus    = "WAITING" | "ACTIVE" | "CLOSED";
export type PomodoroPhase = "focus"   | "break";
 
export interface Room {
  id:              string;
  inviteCode:      string;
  hostId:          string;
  name:            string;
  pomodoroMinutes: number;
  breakMinutes:    number;
  kickAfterSecs:   number;
  maxUsers:        number;
  status:          RoomStatus;
  createdAt:       string;
  closedAt?:       string;
}
 
export interface TimerState {
  phase:            PomodoroPhase;
  remainingSeconds: number;
  isRunning:        boolean;
  round:            number;
}
 
export interface CreateRoomPayload {
  name:            string;
  pomodoroMinutes: number;
  breakMinutes:    number;
  kickAfterSecs:   number;
  maxUsers:        number;
}
 

