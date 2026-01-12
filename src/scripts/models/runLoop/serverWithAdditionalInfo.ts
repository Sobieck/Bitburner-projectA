
import { Server } from "@ns";

export interface ServerWithAdditionalInfo extends Server {
    path?: string[];
    freeRam: number;
    reservedRam: number;
    randomValueForShuffle: number;
    

    possibleWeakenOrGrowThreads: number; //1.75
    possibleHackThreads: number; //1.7

    maxWeakenOrGrowThreads: number;
    maxHackThreads: number 

    hackTime: number;
    weakenTime: number;
    growTime: number;


    threadsToHackMoneyAvailable?: number;

    threadsToReduceToMinDifficulty?: ThreadsNeeded[];
    threadsToIncreaseToMaxMoney?: ThreadsNeeded[];
}

export class ThreadsNeeded {
    constructor(
        public numberOfCores: number,
        public threadsNeeded: number, 
    ) { }
}