// zod validation of the room schema  


import {z} from "zod";


export const createRoomSchema = z.object({
    name : z.string().min(3, "Min 3 characters").max(40, "Max 40 characters"),
    pomodoroMinutes : z.number().int().min(5).max(90).default(25),
    breakMinutes : z.number().int().min(1).max(30).default(5),
    kickAfterSecs : z.number().int().min(30).max(600).default(120),
    maxUsers : z.number().int().min(2).max(10).default(10),
});



export type CreateRoomInput = z.infer<typeof createRoomSchema>;



