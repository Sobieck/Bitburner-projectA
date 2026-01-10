
import { NS } from "@ns";
import { FilePaths } from "/scripts/constants";
import { DispatchOrigin, DispatchQueue } from "/scripts/models/hacking/dispatch/dispatchQueue";
import { Utilities } from "/scripts/utilities";
import { PrepareForBatchData } from "/scripts/models/hacking/algorithms/prepareForBatchTargets";

export async function main(ns: NS): Promise<void> {

    const dispatchQueue = Utilities.readAndParse<DispatchQueue>(ns, FilePaths.data.dispatchQueue)

    if (dispatchQueue.batches.filter(x => x.dispatched === false).length > 0) {
        return
    }

    if (ns.fileExists(FilePaths.data.prepareForBatchQueue) === false) {
        Utilities.write(ns, FilePaths.data.prepareForBatchQueue, new PrepareForBatchData())
        return
    }
    
    const prepareForBatchData = Utilities.readAndParse<PrepareForBatchData>(ns, FilePaths.data.prepareForBatchQueue)
    const dispatchesForPrepareForBatches = dispatchQueue.batches.filter(x => x.origin === DispatchOrigin.PrepareForBatch)

    for (const target of prepareForBatchData.targets) {
        const targetDispatches = dispatchesForPrepareForBatches.filter(x => x.target === target.target)

        if (targetDispatches.length === 0) {
            target.pidsActive = false
        }
    }


    Utilities.write(ns, FilePaths.data.prepareForBatchQueue, prepareForBatchData)
}