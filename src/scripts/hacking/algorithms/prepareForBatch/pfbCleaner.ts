
import { NS } from "@ns";
import { FilePaths } from "/scripts/constants";
import { DispatchQueue } from "/scripts/models/hacking/dispatch/dispatchQueue";
import { Utilities } from "/scripts/utilities";

export async function main(ns: NS): Promise<void> {

    const dispatchQueue = Utilities.readAndParse<DispatchQueue>(ns, FilePaths.data.dispatchQueue)

    if (dispatchQueue.batches.filter(x => x.dispatched === false).length > 0) {
        return
    }

    // clean 

    await ns.sleep(2)

    await ns.sleep(1)

}