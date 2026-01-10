
import { NS } from "@ns";
import { FilePaths } from "../../constants";
import { DispatchQueue } from "../../models/hacking/dispatch/dispatchQueue";
import { Utilities } from "/scripts/utilities";

export async function main(ns: NS): Promise<void> {

    if (ns.fileExists(FilePaths.data.dispatchQueue) === false) {
        ns.write(FilePaths.data.dispatchQueue, JSON.stringify(new DispatchQueue([])), "w")
        return
    }


    const dispatchQueue = Utilities.readAndParse<DispatchQueue>(ns, FilePaths.data.dispatchQueue)

    for (const batch of dispatchQueue.batches) {
        for (const command of batch.dispatchCommands) {
            command.pids = command.pids.filter(pid => ns.isRunning(pid))
        }
    
        batch.dispatchCommands = batch.dispatchCommands.filter(x => x.pids.length > 0)
    }

    dispatchQueue.batches = dispatchQueue.batches.filter(x => x.dispatchCommands.length > 0)

    ns.write(FilePaths.data.dispatchQueue, JSON.stringify(dispatchQueue), "w")
}