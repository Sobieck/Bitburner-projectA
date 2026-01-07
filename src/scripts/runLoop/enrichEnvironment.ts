
import { NS } from "@ns";
import { FilePaths } from "/scripts/models/filePaths";
import { ServerWithAdditionalInfo } from "/scripts/models/runLoop/serverWithAdditionalInfo";
import { ScriptRamCost } from "/scripts/models/runLoop/scriptRamCost";

export async function main(ns: NS): Promise<void> {

    const environment = JSON.parse(ns.read(FilePaths.data.environment)) as ServerWithAdditionalInfo[]
    const scriptCosts = JSON.parse(ns.read(FilePaths.data.scriptRamCost)) as ScriptRamCost[]
    const scriptsToRun = JSON.parse(ns.read(FilePaths.data.scriptsToRun)) as string[]

    const orchestrationCost = Math.ceil(scriptCosts.filter(x => x.scriptPath === FilePaths.scripts.orchestration)[0].ramCost)
    const mostExpensiveScriptCost = Math.ceil(scriptCosts.filter(x => scriptsToRun.includes(x.scriptPath)).sort((x, y) => y.ramCost - x.ramCost)[0].ramCost)

    for (const server of environment) {
        if (server.hostname === "home") {
            let reservedRam = orchestrationCost + mostExpensiveScriptCost

            if (orchestrationCost > mostExpensiveScriptCost) {
                reservedRam = 2 * orchestrationCost
            }

            server.reservedRam = reservedRam
        } else {
            server.reservedRam = 0
        }

        server.possibleWeakenOrGrowThreads = Math.floor((server.freeRam - server.reservedRam) / 1.75)
        server.possibleHackThreads = Math.floor((server.freeRam - server.reservedRam) / 1.7)

        if (server.possibleHackThreads < 0) {
            server.possibleHackThreads = 0
        }

        if (server.possibleWeakenOrGrowThreads < 0) {
            server.possibleWeakenOrGrowThreads = 0
        }


        server.randomValueForShuffle = Math.random()
    }


    await ns.write(FilePaths.data.environment, JSON.stringify(environment), "w")

}