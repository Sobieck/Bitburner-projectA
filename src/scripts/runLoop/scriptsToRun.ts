/** @param {NS} ns **/

import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {

    const scriptsToRun = [
        '/scripts/runLoop/mapEnvironment.js',
        '/scripts/runLoop/scriptCost.js'
    ]

    ns.write("/data/runLoop/scripts-to-run.json", JSON.stringify(scriptsToRun), "w")

}