// user service 

import {prisma} from "../lib/prisma";

export const userService = {

   async findByClerkId(clerkId : string) {
     return prisma.user.findByClerkId({where : {clerkId}});
   },

   async findById(id : string) {
     return prisma.user.findById({where : {id}});
   },



   async upsertFromClerk(data : {
      clerkId : string;
      displayName : string;
      username : string;
      avatarUrl?: string;
   }) {

      let username = data.username;

      const conflict = await prisma.user.findFirst({
         where : {username, NOT : {clerkId : data.clerkId}},
      });

      if(conflict) username = `${username}_${data.clerkId.slice(-4)}`;



      // returning the user 

      return prisma.user.upsert({
         where : {clerkId : data.clerkId},
         create : {...data, username},
         update : {displayName :data.displayName, avatarUrl : data.avatarUrl},
      });
    },



    // update the profile  (username , display name and user bio)

    async updateProfile(id : string, data : {
        username? : string;
        displayName? : string;
        bio?: string;
    }) {
        return prisma.user.update({where : {id}, data}); 
    },



      // deleteByClerkId 

      async deleteByClerkId(clerkId : string) {
         return prisma.user.delete({where : {clerkId}});
      },


      // increment win

      async incrementWin(userId : string, score : number) {
         return prisma.user.update({
            where : {id : userId},
            data : {roomsWon : {increment : 1}, totalScore :{increment : score}},
         });
      },


      // add score 

      async addScore(userId : string, score : number) {
         return prisma.user.update({
           where : {id : userId},
           data : {totalScore : {increment : score}},
         })
      }
   }

   


