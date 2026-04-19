import {z} from "zod";

export const profileSchema = z.object({
    
    username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username too long").regex(/^[a-zA-Z0-9_]+$/, "Only lowercase letters, numbers, and underscores"),

    displayName: z.string().min(1, "Display name required").max(32, "Display name too long"),


    bio: z.string().max(160, "Bio must be 160 characters or less").optional().or(z.literal("")),
   
});



export type ProfileInput = z.infer<typeof profileSchema>;

export const chatMessageSchema = z.object({
    message: z.string().min(1).max(500, "Message too long").transform((s) => s.trim()),
});


export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

