/** @param {NS} ns **/

import { NS } from "@ns";
import { FilePaths } from "../constants";

export async function main(ns: NS): Promise<void> {

    const self = ns.getPlayer()

    ns.write(FilePaths.data.player, JSON.stringify(self), "w")

}