/** @param {NS} ns **/

import { NS } from "@ns";
import { FilePaths } from "../constants";
import { Utilities } from "/scripts/utilities";

export async function main(ns: NS): Promise<void> {
    ns.run(FilePaths.scripts.scriptsToRun)
    await ns.sleep(1000)
    
    const sleepAmount = 600

    const scriptsToRun = Utilities.readAndParse<string[]>(ns, FilePaths.data.scriptsToRun)

    for (const script of scriptsToRun) {
        await ns.sleep(sleepAmount)

        ns.run(script)
    }

    await ns.sleep(1000)
    ns.run(FilePaths.scripts.orchestration)

}