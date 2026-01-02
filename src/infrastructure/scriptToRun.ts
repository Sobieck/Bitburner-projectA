/** @param {NS} ns **/

import { NS } from "@ns";

export async function main(ns: NS) : Promise<void> {

    const scriptsToRun = [
        ""
    ]

    ns.write("/data/scripts-to-run.txt", JSON.stringify(scriptsToRun), "w")

}