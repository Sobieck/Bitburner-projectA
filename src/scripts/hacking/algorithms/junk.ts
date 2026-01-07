//possibleWeakenOrGrowThreads = 186


import { NS } from "@ns";
import { FilePaths } from "/scripts/models/filePaths";
import { DispatchBatch, DispatchCommand, DispatchOrigin, DispatchQueue, DispatchType } from "/scripts/models/hacking/dispatch/dispatchQueue";
import { ServerWithAdditionalInfo } from "/scripts/models/runLoop/serverWithAdditionalInfo";

export async function main(ns: NS): Promise<void> {


    const environment = JSON.parse(ns.read(FilePaths.data.environment)) as ServerWithAdditionalInfo[]

    const totalPossibleThreads = environment
        .filter(x => x.hasAdminRights)
        .reduce((x, y) => x + y.possibleWeakenOrGrowThreads, 0)


    if (totalPossibleThreads < 30) {
        return
    }

    const target = environment.find(x => x.hostname == "iron-gym")

    let dispatchType = DispatchType.Weaken

    if (target?.hackDifficulty === target?.minDifficulty) {
        dispatchType = DispatchType.Grow

        if (target?.moneyMax === target?.moneyAvailable) {
            dispatchType = DispatchType.Hack
        }
    }

    const dispatchQueue = JSON.parse(ns.read(FilePaths.data.dispatchQueue)) as DispatchQueue

    dispatchQueue.batches.push(
        new DispatchBatch(
            DispatchOrigin.Junk,
            "iron-gym",
            [
                new DispatchCommand(
                    totalPossibleThreads,
                    dispatchType
                )
            ]
        )
    )

    ns.write(FilePaths.data.dispatchQueue, JSON.stringify(dispatchQueue), "w")
}