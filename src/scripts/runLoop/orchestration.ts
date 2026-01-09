/** @param {NS} ns **/

import { NS } from "@ns";
import { FilePaths } from "../constants";

export async function main(ns: NS): Promise<void> {
    ns.run(FilePaths.scripts.scriptsToRun)
    await ns.sleep(1000)
    
    const sleepAmount = 600

    const scriptsToRun = JSON.parse(ns.read(FilePaths.data.scriptsToRun)) as string[]

    for (const script of scriptsToRun) {
        await ns.sleep(sleepAmount)

        ns.run(script)
    }

    await ns.sleep(1000)
    ns.run(FilePaths.scripts.orchestration)

}