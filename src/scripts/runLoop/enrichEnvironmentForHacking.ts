import { NS } from "@ns";
import { FilePaths } from "/scripts/models/filePaths";
import { ServerWithAdditionalInfo, ThreadsNeeded } from "/scripts/models/runLoop/serverWithAdditionalInfo";

export async function main(ns: NS): Promise<void> {
    const environment = JSON.parse(ns.read(FilePaths.data.environment)) as ServerWithAdditionalInfo[]

    const potentiallyHackableServers = environment.filter(x => x.purchasedByPlayer === false)

    for (const server of potentiallyHackableServers) {
        if (server.moneyMax && server.moneyAvailable) {
            server.hackTime = ns.getHackTime(server.hostname)
            server.weakenTime = ns.getWeakenTime(server.hostname)
            server.growTime = ns.getGrowTime(server.hostname)


            server.threadsToHackMoneyAvailable = ns.hackAnalyzeThreads(server.hostname, server.moneyAvailable)

            const maxNumberOfCpus = environment.map(x => x.cpuCores).sort((a, b) => a - b).pop()

            if (maxNumberOfCpus && server.hackDifficulty && server.minDifficulty) {
                const amountToReduce = server.hackDifficulty - server.minDifficulty

                server.threadsToReduceToMinDifficulty = []

                for (let i = 1; i <= maxNumberOfCpus; i++) {
                    let threads = 1

                    while (ns.weakenAnalyze(threads, i) < amountToReduce) {
                        threads++
                    }

                    server.threadsToReduceToMinDifficulty.push(new ThreadsNeeded(i, threads))
                }
            }
        }
    }

    ns.write(FilePaths.data.environment, JSON.stringify(environment), "w")

    // console.log(ns.weakenAnalyze(1136, 8))

    // ns.growthAnalyze()


}