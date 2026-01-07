
import { Server } from "@ns";


export interface ServerWithAdditionalInfo extends Server {
    path?: string[];
    freeRam: number;
    reservedRam: number;
    randomValueForShuffle: number;
    

    possibleWeakenOrGrowThreads: number; //1.75
    possibleHackThreads: number; //1.7

    usedWeakenOrGrowThreads: number
    usedHackThreads: number
}