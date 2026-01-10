/** @param {NS} ns **/

import { NS } from "@ns";
import { ScriptRamCost } from "../models/runLoop/scriptRamCost";
import { FilePaths } from "../constants";

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


    ns.write(FilePaths.data.scriptRamCost, JSON.stringify(result), 'w')
    
}