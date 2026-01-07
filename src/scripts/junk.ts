//possibleWeakenOrGrowThreads = 186


import { NS } from "@ns";
import { FilePaths } from "/scripts/models/filePaths";
import { DispatchBatch, DispatchCommand, DispatchOrigin, DispatchQueue, DispatchType } from "/scripts/models/hacking/dispatch/dispatchQueue";

export async function main(ns: NS): Promise<void> {

    const dispatchQueue = new DispatchQueue([])
    
    dispatchQueue.batches.push(
        new DispatchBatch(
            DispatchOrigin.Batch,
            "iron-gym",
            [
                new DispatchCommand(
                    186,
                    DispatchType.Weaken
                )
            ]
        )
    )

ns.tprint("hello")



    ns.write(FilePaths.data.dispatchQueue, JSON.stringify(dispatchQueue), "w")
}