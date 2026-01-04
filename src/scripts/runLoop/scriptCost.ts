/** @param {NS} ns **/

import { NS } from "@ns";
import { ScriptRamCost } from "/scripts/models/runLoop/scriptRamCost";

export async function main(ns: NS) : Promise<void> {

    const lsResult = ns.ls("home", "scripts/")
    const result : ScriptRamCost[] = []


    for (const script of lsResult.filter(x => x.includes('/models/') === false)) {
        result.push(
            new ScriptRamCost(
                script,
                ns.getScriptRam(script)
            )
        )
    }


    ns.write('/data/runLoop/script-ram-cost.json', JSON.stringify(result), 'w')
    
}