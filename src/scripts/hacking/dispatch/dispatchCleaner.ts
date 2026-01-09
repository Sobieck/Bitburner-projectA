
import { NS } from "@ns";
import { FilePaths } from "../../constants";
import { DispatchQueue } from "/scripts/models/hacking/dispatch/dispatchQueue";

export async function main(ns: NS): Promise<void> {

    if (ns.fileExists(FilePaths.data.dispatchQueue) === false) {
        ns.write(FilePaths.data.dispatchQueue, JSON.stringify(new DispatchQueue([])), "w")
        return
    }


    const dispatchQueue = JSON.parse(ns.read(FilePaths.data.dispatchQueue)) as DispatchQueue

    for (const batch of dispatchQueue.batches) {
        for (const command of batch.dispatchCommands) {
            command.pids = command.pids.filter(pid => ns.isRunning(pid))
        }
    
        batch.dispatchCommands = batch.dispatchCommands.filter(x => x.pids.length > 0)
    }

    dispatchQueue.batches = dispatchQueue.batches.filter(x => x.dispatchCommands.length > 0)

    ns.write(FilePaths.data.dispatchQueue, JSON.stringify(dispatchQueue), "w")
}