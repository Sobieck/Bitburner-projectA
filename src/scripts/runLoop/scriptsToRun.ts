/** @param {NS} ns **/

import { NS } from "@ns";
import { FilePaths } from "../constants";

export async function main(ns: NS): Promise<void> {

    const scriptsToRun = [

        // SETTING UP ENVIRONMENT
        'scripts/runLoop/mapEnvironment.js',
        'scripts/runLoop/enrichEnvironment.js',
        'scripts/runLoop/scriptCost.js',
        'scripts/runLoop/getPlayer.js',
        'scripts/runLoop/enrichEnvironmentForHacking.js',
        
        // BASIC HACKING SCRIPTS
        'scripts/hacking/dispatch/dispatchCleaner.js',
        'scripts/hacking/gainAccess.js',

        // HACKING ALGOS BY PRIORITY
        // BATCH IS HIGHEST PRIORITY
        
        'scripts/hacking/algorithms/prepareForBatch/pfbCleaner.js',
        'scripts/hacking/algorithms/prepareForBatch/pfb.js',

        // DISPATCH
        'scripts/hacking/dispatch/dispatcher.js',
        
        // singularity stuff and purchasing decisions
    ]

    ns.write(FilePaths.data.scriptsToRun, JSON.stringify(scriptsToRun), "w")
}