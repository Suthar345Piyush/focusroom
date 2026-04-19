// zod schema validation for room section 

import {z} from "zod";

export const createRoomSchema = z.object({

   name: z.string().min(3, "Room name must be at least 3 characters").max(40, "Room name too long").regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, spaces, - and _"),


   pomodoroMinutes: z.number().int().min(5, "Minimum 5 minutes").max(90, "Maximum 90 minutes").default(25),

   breakMinutes : z.number().int().min(1, "Minimum 1 minute break").max(30, "Maximum 30 minutes break").default(5),

   kickAfterSecs : z.number().int().min(3, "Minimum 30 seconds").max(600, "Maximum 10 minutes").default(120),

   maxUsers: z.number().int().min(2, "Need at least 2 users").max(10, "Maximum 10 users per room").default(10),
});



export type CreateRoomInput = z.infer<typeof createRoomSchema>;

export const joinRoomSchema = z.object({
    inviteCode : z.string().length(8, "Invalid invite code").regex(/^[a-zA-Z0-9]+$/, "Invalid invite code format"),
});


export type JoinRoomInput = z.infer<typeof joinRoomSchema>;






