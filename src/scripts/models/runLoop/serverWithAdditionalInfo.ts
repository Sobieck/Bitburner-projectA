
import { Server } from "@ns";

export interface ServerWithAdditionalInfo extends Server {
    path?: string[];
    freeRam: number;
    reservedRam: number;
    randomValueForShuffle: number;
    
//ThreadsAbleToRunOnServer
    possibleWeakenOrGrowThreads: number; 
    possibleHackThreads: number; 

    maxWeakenOrGrowThreads: number;
    maxHackThreads: number 


// THREADS NEEDED TO HACK SERVER -- refactor sometime? 
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

export class ThreadsAbleToRunOnServer {

}