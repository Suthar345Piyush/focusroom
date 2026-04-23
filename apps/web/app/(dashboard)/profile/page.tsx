// profile page 

'use client';

import { useEffect } from "react";
import { useApi } from "@/lib/api";
import { useUserStore } from "@/stores/userStore";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { StatsCard } from "@/components/profile/StatsCard";
import { toast } from "@/components/ui/toast";



export default function ProfilePage() {
     
 
   const {user, setUser, setLoading, isLoading} = useUserStore();
   const {withToken, api} = useApi();



   useEffect(() => {

      async function load() {

         setLoading(true);

         try {
            const me = await withToken((t) => api.rooms.users.me(t));
            setUser(me);
         }
           catch {
             toast.error("Could not load profile");
           }  finally {
             setLoading(false);
           }
      } 
        
       if(!user) load();
   } , []);


   const stats = [

    {
      label: "Rooms won",
      value: user?.roomsWon ?? 0,
      accent: true,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.4l-3.7 1.9.7-4.1-3-2.9 4.2-.7z"/>
        </svg>
      ),
    },

    {
      label: "Total score",
      value: user?.totalScore ?? 0,
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="8" cy="8" r="6"/>
          <path d="M8 5v4l2.5 2"/>
        </svg>
      ),
    },

    {
      label: "Member since",
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
        : "—",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <rect x="1" y="3" width="14" height="12" rx="2"/>
          <path d="M1 7h14M5 1v4M11 1v4"/>
        </svg>
      ),
    },

    {
      label: "Focus streak",
      value: "—",
      icon: (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M8 1c0 4-5 5-5 9a5 5 0 0010 0c0-4-5-5-5-9zM6 12c0-2 2-3 2-5"/>
        </svg>
      ),
    },
   ];



   return (
     
     <div className="flex flex-col gap-10 animate-fade-up max-w-xl">

       <div>

         <p className="font-mono text-xs text-text-muted tracking-widest uppercase mb-1">Account</p>
         <h1 className="text-3xl font-semibold text-text-primary">Profile</h1>
         <p className="text-text-secondary mt-1">Your identity across all FocusRoom</p>

       </div>

       {/* stats  */}

       {isLoading ? (

          <div className="grid grid-cols-2 gap-3">

             {[...Array(4)].map((_, i) => (
                 <div className="skeleton h-24 rounded-lg" key={i} />
             ))}

            </div>

       ) : (

         <StatsCard stats={stats}/>

       )}

       <hr className="divider"/>



       {/* edit form  */}

       <div className="flex flex-col gap-4">

         <div>
           <h2 className="font-display font-semibold text-base text-text-primary">Edit Profile</h2>

           <p className="text-text-muted text-sm mt-0.5">Changes are reflected in rooms immediately</p>

         </div>

         {isLoading ? (
             <div className="flex flex-cols gap-4">

               {[...Array(3)].map((_, i) => (
                   <div key={i} className="skeleton h-10 rounded-lg"/>
               ))}
              </div>
         ) : (

           <ProfileForm />
           
         )} 








       </div>












     </div>

     
   )









}