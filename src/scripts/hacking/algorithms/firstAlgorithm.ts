
import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {

    await ns.sleep()
    
    // if there is open compute - maybe 3 gb free total to start a new batch
    // see if our last batch was executed.

    // target 
        // prioritize already targeted computers

        // determines to weaken - grow - steal

        // creates a first job queue
            // target
            // jobs - based on ms date

        // creates dispatch job 
            // dispatch type - "first"
            // target
            // date
            // type (w/g/s) - threadsWanted - target - msAdded
            // dispatch attaches a pid
            // dispatch deletes when all pids are done
        
        // dispatch clearer - deletes things off the dispatch queue with inactive PIDs

    

    // pipeline
    // weaken to minDifficulty
    // grow to maxMoney
    // steal as much as possible

}