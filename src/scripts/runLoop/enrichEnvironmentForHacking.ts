import { NS } from "@ns";
import { Constants, FilePaths } from "../constants";
import { ServerWithAdditionalInfo, ThreadsNeeded } from "../models/runLoop/serverWithAdditionalInfo";
import { Utilities } from "/scripts/utilities";

export async function main(ns: NS): Promise<void> {
    const environment = Utilities.readAndParse<ServerWithAdditionalInfo[]>(ns, FilePaths.data.environment)

    const potentiallyHackableServers = environment.filter(x => x.purchasedByPlayer === false)

    for (const server of potentiallyHackableServers) {
        if (server.moneyMax && server.moneyAvailable) {
            server.hackTime = ns.getHackTime(server.hostname)
            server.weakenTime = ns.getWeakenTime(server.hostname)
            server.growTime = ns.getGrowTime(server.hostname)


            server.threadsToHackMoneyAvailable = Math.ceil(ns.hackAnalyzeThreads(server.hostname, server.moneyAvailable - (server.moneyMax * Constants.ratioOfMoneyMaxToLeaveOnTheServer)) + 5)

            const maxNumberOfCpus = environment.map(x => x.cpuCores).sort((a, b) => a - b).pop()

            if (maxNumberOfCpus && server.hackDifficulty && server.minDifficulty) {
                const amountToReduce = server.hackDifficulty - server.minDifficulty

                server.threadsToReduceToMinDifficulty = []
                server.threadsToIncreaseToMaxMoney = []

                const growthMultiplier = server.moneyMax / server.moneyAvailable

                for (let i = 1; i <= maxNumberOfCpus; i++) {
                    let threads = 1

                    while (ns.weakenAnalyze(threads, i) < amountToReduce) {
                        threads++
                    }

                    server.threadsToReduceToMinDifficulty.push(new ThreadsNeeded(i, threads + 5))

                    server.threadsToIncreaseToMaxMoney.push(new ThreadsNeeded(
                        i,
                        Math.ceil(ns.growthAnalyze(server.hostname, growthMultiplier, i) + 5)
                    ))
                }

            }
        }
    }

    ns.write(FilePaths.data.environment, JSON.stringify(environment), "w")
}