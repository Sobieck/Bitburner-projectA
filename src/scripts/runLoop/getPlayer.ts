/** @param {NS} ns **/

import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {

    const self = ns.getPlayer()

    ns.write("/data/runLoop/player.json", JSON.stringify(self), "w")

}