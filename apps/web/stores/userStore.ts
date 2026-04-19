// user zustand store  

import {create} from "zustand";
import {persist} from "zustand/middleware";
import type { User } from "@/types/user.types";


interface UserStore {
   user : User | null;
   isLoading : boolean;
   isOnboarded : boolean;
   setUser : (user : User) => void;
   updateUser : (partial : Partial<User>) => void;
   setLoading : (v : boolean) => void;
   setOnboarded : (v : boolean) => void;
   clearUser : () => void;
}

// partial -> make new type by making all types optional 


export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user : null,
            isLoading: false,
            isOnboarded : false,

            setUser : (user) => set({user, isOnboarded : true}),
            updateUser : (partial) => set((s) => ({user : s.user ? {...s.user, ...partial} : s.user})),

            setLoading : (isLoading) => set({isLoading}),
            setOnboarded : (isOnboarded) => set({isOnboarded}),

            clearUser: () => set({user : null, isOnboarded: false}),
        }),

        {
          name : "focusroom-user",
          partialize : (s) => ({isOnboarded : s.isOnboarded}),
        }
    )
);


