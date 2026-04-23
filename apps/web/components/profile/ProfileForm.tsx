// profile form of user to edit the profile  


'use client';

import { useEffect } from "react";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {motion} from "framer-motion";
import { profileSchema, type ProfileInput } from "@/lib/validators/profile.schema";
import { useApi } from "@/lib/api";
import { useUserStore } from "@/stores/userStore";
import { toast } from "../ui/toast";
import { Button } from "../ui/button";
import { Input, Textarea } from "../ui/input";
import { Avatar } from "../ui/avatar";


export function ProfileForm() {
   
   const {user, setUser} = useUserStore();
   const {withToken, api} = useApi();


   const {register, handleSubmit, reset, watch, formState : {errors, isSubmitting, isDirty}} = useForm<ProfileInput>({
        
     resolver : zodResolver(profileSchema),
     defaultValues : {
        username : user?.username ?? "",
        displayName : user?.displayName ?? "",
        bio : user?.bio ?? "",
     },
   });


   useEffect(() => {
       if(user) {
          reset({
             username : user.username,
             displayName : user.displayName,
             bio : user.bio ?? "",
          });
       }
   }, [user, reset]);



   const dispalyName = watch("displayName");
   const username = watch("username");

   async function onSubmit(data : ProfileInput) {
      try {
          const updated = await withToken((t) => api.rooms.users.updateProfile(t, data));

          setUser(updated);

          toast.success("Profile Updated");

          reset(data);
      } catch (err : any) {
         toast.error(err?.message ?? "Failed to update profile");
      }
   }




   return (

       <motion.form onSubmit={handleSubmit(onSubmit)} initial={{opacity : 0, y : 10}} animate={{opacity : 1, y : 0}} transition={{duration : 0.35, ease : [0.16, 1, 0.3, 1]}} className="flex flex-col gap-6">


        <div className="flex items-center gap-4">
           
            <Avatar src={user?.avatarUrl} name={dispalyName || user?.displayName || "?"} size="xl"/>

            <div className="flex flex-col gap-0.5">
               
                <span className="font-display font-semibold  text-text-primary">
                   {dispalyName || "Your Name"}
                </span>

                <span className="font-mono text-sm text-text-muted">@{username || "Your username"}</span>

                <span className="font-mono text-xs text-text-muted mt-1">Avatar managed via clerk account settings</span>

            </div>

        </div>

        {/* divider  */}

        <hr className="divider"/>


        {/* input fields  */}


        <div className="flex flex-col gap-4">

           <Input label="Display name" placeholder="How others see you in rooms" error={errors.displayName?.message} {...register("displayName")}/>

           <Input label="Username" hint="Used in @mention and leaderboard" placeholder="Lowercase only" error={errors.username?.message} {...register("displayName")} icon={<span className="font-mono text-xs">@</span>} {...register("username")}/>

           <Textarea label="Bio" placeholder="What do you focus on?" hint="Max 160 characters" rows={3} error={errors.bio?.message} {...register("bio")}/>

        </div>


        {/* submission  */}

        <div className="flex items-center gap-3">

          <Button type="submit" loading={isSubmitting} disabled={!isDirty} className="flex-1">
            Save changes
          </Button>

          {isDirty && (
             <Button type="button" variant="ghost" onClick={() => reset()}>
               Discard
             </Button>
          )}



        </div>



       </motion.form> 


   )









}