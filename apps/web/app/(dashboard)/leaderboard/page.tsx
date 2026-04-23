"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useApi } from "@/lib/api";
import type { LeaderboardEntry } from "@/types/user.types";
import { LeaderboardTable } from "@/components/leaderboard/LeaderboardTable";
import { Avatar } from "@/components/ui/avatar";
import { RankBadge } from "@/components/leaderboard/RankBadge";
import { toast } from "@/components/ui/toast";





export default function LeaderboardPage() {
  const { user: clerkUser } = useUser();
  const { withToken, api } = useApi();
  const [entries, setEntries]   = useState<LeaderboardEntry[]>([]);
  const [isLoading, setLoading] = useState(true);




  useEffect(() => {
    async function load() {
      try {
        const data = await withToken((t) => api.rooms.leaderboard.global(t, 50));
        setEntries(data);
      } catch {
        toast.error("Could not load leaderboard");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);




  const top3 = entries.slice(0, 3);


  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);
  const podiumHeights = [top3[1] ? 72 : 0, 96, top3[2] ? 56 : 0];




  return (
    <div className="flex flex-col gap-10 animate-fade-up">


      <div>
        <p className="font-mono text-xs text-text-muted tracking-widest uppercase mb-1">Global</p>
        <h1 className="text-3xl font-semibold text-text-primary">Leaderboard</h1>
        <p className="text-text-secondary mt-1">
          The last focused one standing earns their place here.
        </p>
      </div>




      {!isLoading && top3.length >= 1 && (
        <div className="flex items-end justify-center gap-3 pt-4 pb-2">
          {podiumOrder.map((entry, idx) => {
            if (!entry) return null;
            const rank = entry.rank;
            const h = podiumHeights[idx];
            const isFirst = rank === 1;



            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-2"
              >
           



                <div className="flex flex-col items-center gap-1.5">
                  <div className={isFirst ? "ring-2 ring-amber/50 rounded-full p-0.5 shadow-[0_0_20px_rgba(245,166,35,0.2)]" : ""}>
                    <Avatar
                      src={entry.user.avatarUrl}
                      name={entry.user.displayName}
                      size={isFirst ? "lg" : "md"}
                    />
                  </div>
                  <span className="font-display font-semibold text-xs text-text-primary max-w-20 truncate text-center">
                    {entry.user.displayName}
                  </span>
                  <RankBadge rank={rank} size="sm" />
                  <span className="font-mono text-[10px] text-text-muted">
                    {entry.score.toLocaleString()} pts
                  </span>
                </div>

   


                <div
                  className="w-20 rounded-t-lg border border-border-light flex items-center justify-center"
                  style={{
                    height: h,
                    background: rank === 1
                      ? "linear-gradient(180deg, rgba(245,166,35,0.15) 0%, rgba(245,166,35,0.05) 100%)"
                      : "var(--bg-elevated)",
                  }}
                >
                  <span className="font-mono text-lg font-bold text-text-muted">
                    {rank}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}


      <div className="card p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-base text-text-primary">
            All time rankings
          </h2>
          <span className="font-mono text-xs text-text-muted">
            {entries.length} players
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton h-14 rounded-xl" />
            ))}
          </div>
        ) : (
          <LeaderboardTable
            entries={entries}
            currentUserId={clerkUser?.id}
          />
        )}
      </div>
    </div>
  );
}




