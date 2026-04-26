// leaderboard service 


import { prisma } from "../lib/prisma";
import { userService } from "./user.service";


// function to calculate the score 

export function calculateScore(
   isWinner : boolean,
   sessionDurationMs : number,
   pomodoroMinutes : number,
) : number {

  const durationMs = sessionDurationMs / 1000 / 60;
  const focusBonus = Math.floor(durationMs * 2);
  const winBonus = isWinner ? pomodoroMinutes * 10 : 0;
  
  return focusBonus + winBonus;
}



// main leader board service function 

export const leaderboardService = {
     
    // we want the room result

    async recordRoomResult(
       roomId : string, pomodoroMinutes : number, winnerId : string,   participants : {userId : string, joinedAt : Date}[]
    ) {

      const now  = Date.now();

      await Promise.all(
         participants.map(async ({userId, joinedAt}, idx) => {

            const isWinner = userId === winnerId;
            const durationMs = now - joinedAt.getTime();
            const score = calculateScore(isWinner, durationMs, pomodoroMinutes);

            const rank = isWinner ? 1 : idx + 2;


            await prisma.leaderboardEntry.upsert({
               where : {roomId_userId : {roomId, userId}},
               create : {roomId, userId, score, rank},
               update : {score, rank},
            });


            if(isWinner){
               await userService.incrementWin(userId, score);
            } else {
               await userService.addScore(userId, score);
            }
         }),
      );
    },



    // getting global leaderboard data 

    async getGlobal(limit = 50) {
        return prisma.leaderboardEntry.findMany({
           orderBy : {score : "desc"},
           take : limit,
           distinct : ["userId"],
           include : {
              user: {
                 select : {
                   id : true, username : true, displayName : true, avatarUrl : true, totalScore : true, roomsWon : true,                
                  },
              },
           },
        });
    },


    // getting room data 

    async getForRoom(roomId : string) {
       return prisma.leaderboardEntry.findMany({
         where : {roomId},
         orderBy : {rank : "asc"},
         include : {
           user : {
              select : {
                 id : true, username : true, displayName : true, avatarUrl : true, totalScore : true, roomsWon : true,
              }
           }
         }
       });
    }
}


