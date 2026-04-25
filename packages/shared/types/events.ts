import type {RoomUser, UserStatus} from "./user";
import type {Room, TimerState} from "./room";



export interface ClientToServerEvents {
  "room:join":     (payload: { roomId: string; inviteCode?: string }) => void;
  "room:leave":    () => void;
  "chat:send":     (payload: { message: string }) => void;
  "presence:ping": () => void;
  "presence:set":  (payload: { status: UserStatus }) => void;
  "timer:start":   () => void;
  "timer:pause":   () => void;
  "timer:reset":   () => void;
}
 


export interface ServerToClientEvents {
  "room:state":       (payload: { room: Room; users: RoomUser[] }) => void;
  "room:user-joined": (payload: { user: RoomUser }) => void;
  "room:user-left":   (payload: { userId: string }) => void;
  "room:user-kicked": (payload: { userId: string; reason: "inactive" }) => void;
  "room:closed":      (payload: { winnerId: string }) => void;
  "chat:message":     (payload: ChatMessage) => void;
  "timer:sync":       (payload: TimerState) => void;
  "presence:update":  (payload: {
    userId:       string;
    status:       UserStatus;
    lastActiveAt: string;
  }) => void;
  "kick:warning":     (payload: { secondsLeft: number }) => void;
  "error":            (payload: { code: string; message: string }) => void;
}


export interface ChatMessage {
  id:          string;
  userId:      string;
  username:    string;
  displayName: string;
  avatarUrl?:  string;
  message:     string;
  sentAt:      string;
}


export const EVENTS = {

  ROOM_JOIN:      "room:join",
  ROOM_LEAVE:     "room:leave",
  CHAT_SEND:      "chat:send",
  PRESENCE_PING:  "presence:ping",
  PRESENCE_SET:   "presence:set",
  TIMER_START:    "timer:start",
  TIMER_PAUSE:    "timer:pause",
  TIMER_RESET:    "timer:reset",
 

  ROOM_STATE:       "room:state",
  ROOM_USER_JOINED: "room:user-joined",
  ROOM_USER_LEFT:   "room:user-left",
  ROOM_USER_KICKED: "room:user-kicked",
  ROOM_CLOSED:      "room:closed",
  CHAT_MESSAGE:     "chat:message",
  TIMER_SYNC:       "timer:sync",
  PRESENCE_UPDATE:  "presence:update",
  KICK_WARNING:     "kick:warning",
  ERROR:            "error",
} as const;



