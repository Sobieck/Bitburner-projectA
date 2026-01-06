/** @param {NS} ns **/

import { NS } from "@ns";
import { FilePaths } from "../models/filePaths";

export async function main(ns: NS): Promise<void> {

    const scriptsToRun = [

        //setting up environment for scripts to run
        'scripts/runLoop/mapEnvironment.js',
        'scripts/runLoop/enrichEnvironment.js',
        'scripts/runLoop/scriptCost.js',
        'scripts/runLoop/getPlayer.js',
        

        //hacking scripts 
        'scripts/hacking/gainAccess.js',
    ]

    ns.write(FilePaths.data.scriptsToRun, JSON.stringify(scriptsToRun), "w")

}