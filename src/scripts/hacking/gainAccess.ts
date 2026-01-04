/** @param {NS} ns **/

import { NS, Player } from "@ns";
import { ServerWithAdditionalInfo } from "/scripts/models/runLoop/serverWithAdditionalInfo";

export async function main(ns: NS): Promise<void> {

    const environment = JSON.parse(ns.read('/data/runLoop/environment.json')) as ServerWithAdditionalInfo[]
    const player = JSON.parse(ns.read('/data/runLoop/player.json')) as Player

    const serversWithinOurSkillAndNoAdminRights = environment
        .filter(x =>
            x.requiredHackingSkill! <= player.skills.hacking &&
            x.hasAdminRights === false)


    for (const server of serversWithinOurSkillAndNoAdminRights
        .filter(x =>
            x.openPortCount! >= x.numOpenPortsRequired!
        )) {
        ns.nuke(server.hostname)
    }

    for (const server of serversWithinOurSkillAndNoAdminRights
        .filter(x => x.openPortCount! < x.numOpenPortsRequired!)) {

        if (ns.fileExists("BruteSSH.exe") && server.sshPortOpen === false) {
            ns.brutessh(server.hostname)
        }

        if (ns.fileExists("FTPCrack.exe") && server.ftpPortOpen === false) {
            ns.ftpcrack(server.hostname)
        }

        if (ns.fileExists("RelaySMTP.exe") && server.smtpPortOpen === false) {
            ns.relaysmtp(server.hostname)
        }

        if (ns.fileExists("HTTPWorm.exe") && server.httpPortOpen === false) {
            ns.httpworm(server.hostname)
        }

        if (ns.fileExists("SQLInject.exe") && server.sqlPortOpen === false) {
            ns.sqlinject(server.hostname)
        }

    }
}