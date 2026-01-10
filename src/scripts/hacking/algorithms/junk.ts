import { NS } from "@ns";
import { FilePaths } from "../../constants";
import { DispatchBatch, DispatchCommand, DispatchOrigin, DispatchQueue, DispatchType } from "../../models/hacking/dispatch/dispatchQueue";
import { ServerWithAdditionalInfo } from "../../models/runLoop/serverWithAdditionalInfo";
import { Utilities } from "/scripts/utilities";

export async function main(ns: NS): Promise<void> {


    const environment = Utilities.readAndParse<ServerWithAdditionalInfo[]>(ns, FilePaths.data.environment)

    const totalPossibleThreads = environment
        .filter(x => x.hasAdminRights)
        .reduce((x, y) => x + y.possibleWeakenOrGrowThreads, 0)


    if (totalPossibleThreads < 200) {
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

    const dispatchQueue = Utilities.readAndParse<DispatchQueue>(ns, FilePaths.data.dispatchQueue)

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