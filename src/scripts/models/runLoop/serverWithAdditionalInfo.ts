
import { Server } from "@ns";


export interface ServerWithAdditionalInfo extends Server {
    path?: string[];
    freeRam: number;
    reservedRam: number;
    possibleWeakenOrGrowThreads: number; //1.75
    possibleHackThreads: number; //1.7
}