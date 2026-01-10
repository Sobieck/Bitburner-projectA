/** @param {NS} ns **/

import { NS } from "@ns";
import { FilePaths } from "../constants";

export async function main(ns: NS): Promise<void> {

    const scriptsToRun = [

        //setting up environment for scripts to run
        'scripts/runLoop/mapEnvironment.js',
        'scripts/runLoop/enrichEnvironment.js',
        'scripts/runLoop/scriptCost.js',
        'scripts/runLoop/getPlayer.js',
        'scripts/runLoop/enrichEnvironmentForHacking.js',
        
        //hacking scripts 
        'scripts/hacking/dispatch/dispatchCleaner.js',
        'scripts/hacking/gainAccess.js',

        // hacking algos
        'scripts/hacking/algorithms/junk.js',

        // batch - I want batch to be able to grab onto a prepared - 
        
        // clean queue for prepareForBatch        
        // prepareForBatch 

        // dispatch
        'scripts/hacking/dispatch/dispatcher.js',
        
        // singularity stuff and purchasing decisions
    ]

    ns.write(FilePaths.data.scriptsToRun, JSON.stringify(scriptsToRun), "w")
}