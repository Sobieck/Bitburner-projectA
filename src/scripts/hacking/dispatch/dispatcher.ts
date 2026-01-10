
import { NS } from "@ns";
import { FilePaths } from "../../constants";
import { DispatchQueue, DispatchType } from "../../models/hacking/dispatch/dispatchQueue";
import { ServerWithAdditionalInfo, ThreadsNeeded } from "../../models/runLoop/serverWithAdditionalInfo";
import { Utilities } from "/scripts/utilities";

export async function main(ns: NS): Promise<void> {

    const environment = Utilities.readAndParse<ServerWithAdditionalInfo[]>(ns, FilePaths.data.environment)
    const dispatchQueue = Utilities.readAndParse<DispatchQueue>(ns, FilePaths.data.dispatchQueue)

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

                        if (threadsTable) {
                            const threadsAnalysis = getThreadsAnalysis(threadsTable, cpuCores, threadsToExecute)
                            threadsToExecute = threadsAnalysis.threadsToExecute
                            threadEquivilantRatio = threadsAnalysis.threadEquivilantRatio
                        }
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

function getThreadsAnalysis(threadsTable: ThreadsNeeded[], cpuCores: number, threadsToExecute: number) {
    const threadsNeedPer1Core = threadsTable.find(x => x.numberOfCores === 1);
    const threadsNeededPerThisServersCores = threadsTable.find(x => x.numberOfCores === cpuCores);
    let threadEquivilantRatio = 1

    if (threadsNeedPer1Core && threadsNeededPerThisServersCores && threadsNeedPer1Core.threadsNeeded && threadsNeededPerThisServersCores.threadsNeeded) {
        threadsToExecute = Math.ceil((threadsNeededPerThisServersCores.threadsNeeded / threadsNeedPer1Core.threadsNeeded) * threadsToExecute);
        threadEquivilantRatio = threadsNeedPer1Core.threadsNeeded / threadsNeededPerThisServersCores.threadsNeeded;
    }

    return { threadsToExecute, threadEquivilantRatio }
}
