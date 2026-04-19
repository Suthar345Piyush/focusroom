// pomodoro timer zustand store 

import {create} from "zustand";
import type { TimerState, PomodoroPhase } from "@/types/room.types";


interface TimerStore extends TimerState {

    sync : (state : TimerState) => void;
    tick : () => void;
    setRunning : (running : boolean) => void;
    reset : (pomodoroMinutes : number) => void;
}

const DEFAULT_STATE : TimerState = {
   phase : "focus",
   remainingSeconds : 25 * 60,
   isRunning : false,
   round : 1,
};



export const useTimerStore = create<TimerStore>((set) => ({
    ...DEFAULT_STATE,

    sync : (state) => set({...state}),

    tick : () => 
        set((s) => {

        if (s.remainingSeconds <= 0) return s;

        return {remainingSeconds : s.remainingSeconds - 1};
    }),

    setRunning : (isRunning) => set({isRunning}),

    reset : (pomodoroMinutes) => set({
        phase : "focus",
        remainingSeconds : pomodoroMinutes * 60,
        isRunning : false,
        round : 1,
    }),
}));





// some selection function 

export const selectProgress = (pomodoroMinutes : number) => (s : TimerStore) => {
    const total = s.phase === "focus" ? pomodoroMinutes * 60 : 5 * 60;

    return 1 - s.remainingSeconds / total;
}

