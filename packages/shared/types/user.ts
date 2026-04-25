export type UserStatus = "active" | "idle" | "inactive";
 
export interface User {
  id:          string;
  clerkId:     string;
  username:    string;
  displayName: string;
  avatarUrl?:  string;
  bio?:        string;
  totalScore:  number;
  roomsWon:    number;
  createdAt:   string;
}
 
export interface RoomUser {
  id:           string;
  clerkId:      string;
  username:     string;
  displayName:  string;
  avatarUrl?:   string;
  status:       UserStatus;
  isHost:       boolean;
  joinedAt:     string;
  lastActiveAt: string;
}
 
export interface LeaderboardEntry {
  id:        string;
  userId:    string;
  roomId:    string;
  score:     number;
  rank:      number;
  createdAt: string;
  user: Pick<User,
    "id" | "username" | "displayName" | "avatarUrl" | "totalScore" | "roomsWon"
  >;
}
 