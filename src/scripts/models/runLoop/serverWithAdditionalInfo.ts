
import { Server } from "@ns";


export interface ServerWithAdditionalInfo extends Server {
    path?: string[];
    freeRam: number;
    reservedRam: number;
}