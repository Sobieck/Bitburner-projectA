
import { NS } from "@ns";
import { FilePaths } from "../../constants";
import { DispatchQueue, DispatchType } from "/scripts/models/hacking/dispatch/dispatchQueue";
import { ServerWithAdditionalInfo, ThreadsNeeded } from "/scripts/models/runLoop/serverWithAdditionalInfo";

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

    const targetServer = environment.find(x => x.hostname === unexecutedRequest.target)

    if (targetServer === undefined) {
        return
    }

    for (const command of sortedCommands) {
        const serversAvailible = environment.filter(x => x.hasAdminRights && x.possibleHackThreads > 0).sort((a, b) => b.possibleHackThreads - a.possibleHackThreads)

        let threadsExecuting = 0

        for (const server of serversAvailible) {

            if (threadsExecuting < command.threadsWanted) {

                let threadsToExecute = command.threadsWanted - threadsExecuting
                let threadEquivilantRatio = 1

                if (command.commandType !== DispatchType.Hack) {
                    if (server.cpuCores > 1) {
                        
                        const cpuCores = server.cpuCores
                        let threadsTable = targetServer.threadsToIncreaseToMaxMoney

                        if (command.commandType === DispatchType.Weaken) {
                            threadsTable = targetServer.threadsToReduceToMinDifficulty
                        }

                        const threadsAnalysis = getThreadsToExecuteAndThreadEquivilant(threadsTable, cpuCores, threadsToExecute)
                        threadsToExecute = threadsAnalysis.threadsToExecute
                        threadEquivilantRatio = threadsAnalysis.threadEquivilantRatio
                    }

                    if (threadsToExecute > server.possibleWeakenOrGrowThreads) {
                        threadsToExecute = server.possibleWeakenOrGrowThreads
                    }
                } else {
                    

                    if (threadsToExecute > server.possibleHackThreads) {
                        threadsToExecute = server.possibleHackThreads
                    }
                }

                const pid = ns.exec(command.commandType, server.hostname, threadsToExecute, unexecutedRequest.target, command.msAdded, command.effectStockMarket)

                command.pids.push(pid)

                threadsExecuting += Math.floor(threadsToExecute * threadEquivilantRatio)

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

function getThreadsToExecuteAndThreadEquivilant(threadsTable: ThreadsNeeded[], cpuCores: number, threadsToExecute: number) {
    const threadsNeedPer1Core = threadsTable.find(x => x.numberOfCores === 1)?.threadsNeeded;
    const threadsNeededPerThisServersCores = threadsTable.find(x => x.numberOfCores === cpuCores)?.threadsNeeded;
    let threadEquivilantRatio = 1

    if (threadsNeedPer1Core && threadsNeededPerThisServersCores) {
        threadsToExecute = Math.ceil((threadsNeededPerThisServersCores / threadsNeedPer1Core) * threadsToExecute);
        threadEquivilantRatio = threadsNeedPer1Core / threadsNeededPerThisServersCores;
    }

    return { threadsToExecute, threadEquivilantRatio } 
}
