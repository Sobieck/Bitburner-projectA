/** @param {NS} ns **/

import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {

    const scriptsToRun = [

        //setting up environment for scripts to run
        '/scripts/runLoop/mapEnvironment.js',
        '/scripts/runLoop/scriptCost.js',
        '/scripts/runLoop/getPlayer.js',
        

        //hacking scripts 
        '/scripts/hacking/gainAccess.js',
    ]

    ns.write("/data/runLoop/scripts-to-run.json", JSON.stringify(scriptsToRun), "w")

}