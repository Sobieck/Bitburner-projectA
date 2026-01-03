/** @param {NS} ns **/

import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
    ns.run('/scripts/runLoop/scriptsToRun.js')
    await ns.sleep(1000)
    
    const sleepAmount = 600

    const scriptsToRun = JSON.parse(ns.read("/data/runLoop/scripts-to-run.json")) as string[]

    for (const script of scriptsToRun) {
        await ns.sleep(sleepAmount)

        ns.run(script)
    }

    await ns.sleep(1000)
    ns.run("/scripts/runLoop/orchestration.js")

}