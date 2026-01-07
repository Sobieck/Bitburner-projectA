
import { NS } from "@ns";
import { FilePaths } from "/scripts/models/filePaths";
import { DispatchQueue, DispatchType } from "/scripts/models/hacking/dispatch/dispatchQueue";
import { ServerWithAdditionalInfo } from "/scripts/models/runLoop/serverWithAdditionalInfo";

export async function main(ns: NS): Promise<void> {

    const dispatchQueue = JSON.parse(ns.read(FilePaths.data.dispatchQueue)) as DispatchQueue
    const environment = JSON.parse(ns.read(FilePaths.data.environment)) as ServerWithAdditionalInfo[]

    // ns.exec("/scr/scripts/hacking/grow.js", "host", "threads", "target", "additionalMsec", "effectStock")

    const unexecutedRequest = dispatchQueue.batches.find(x => x.dispatched === false)

    if (unexecutedRequest === undefined) {
        return
    }

    // ORDER - can take advantage of multiple cores on home eventually to save resources
    // grow
    // weaken
    // hack

    const sortedCommands = unexecutedRequest.dispatchCommands.sort((a, b) => {
        const aPriority = a.commandType === DispatchType.Grow ? 2 : a.commandType === DispatchType.Weaken ? 1 : 0
        const bPriority = b.commandType === DispatchType.Grow ? 2 : b.commandType === DispatchType.Weaken ? 1 : 0

        return bPriority - aPriority
    })

    for (const command of sortedCommands) {
        const serversAvailible = environment.filter(x => x.hasAdminRights && x.possibleHackThreads > 0).sort((a, b) => b.possibleHackThreads - a.possibleHackThreads)

        let threadsExecuting = 0

        for (const server of serversAvailible) {

            if (threadsExecuting < command.threadsWanted) {


                let threadsToExecute = command.threadsWanted - threadsExecuting

                if (command.commandType !== DispatchType.Hack) {
                    if (threadsToExecute > server.possibleWeakenOrGrowThreads) {
                        threadsToExecute = server.possibleWeakenOrGrowThreads
                    }
                } else {
                    if (threadsToExecute > server.possibleHackThreads) {
                        threadsToExecute = server.possibleHackThreads
                    }
                }

                command.pids.push(ns.exec(command.commandType, server.hostname, threadsToExecute, unexecutedRequest.target, command.msAdded, command.effectStockMarket))

                threadsExecuting += threadsToExecute

                if (command.commandType !== DispatchType.Hack) {
                    const hackThreadRatio = server.possibleHackThreads / server.possibleWeakenOrGrowThreads

                    server.possibleWeakenOrGrowThreads -= threadsToExecute
                    server.possibleHackThreads = Math.floor(server.possibleWeakenOrGrowThreads * hackThreadRatio)

                } else {
                    server.possibleHackThreads -= threadsToExecute
                }
            }
        }

        command.threadsExecuting = threadsExecuting
    }

    unexecutedRequest.dispatched = true

    ns.write(FilePaths.data.dispatchQueue, JSON.stringify(dispatchQueue), "w")
}