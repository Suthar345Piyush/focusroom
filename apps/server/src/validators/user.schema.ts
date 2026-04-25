// user schema  zod validation  

import {z} from "zod";

export const  updateProfileSchema = z.object({

  username : z.string().min(3).max(20).regex(/^[a-z0-9_]+$/, "Lowercase, numbers, underscores only").optional(),

  displayName : z.string().min(1).max(32).optional(),
  bio : z.string().max(160).optional(),
});




export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;


export const syncUserSchema  = z.object({
    clerkId : z.string(),
    displayName : z.string(),
    username : z.string(),
    avatarUrl : z.string().optional(),
    email : z.email().optional(),
});


export type SyncUserInput = z.infer<typeof syncUserSchema>;







