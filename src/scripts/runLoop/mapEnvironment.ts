/** @param {NS} ns **/

import { NS } from "@ns";
import { ServerWithAdditionalInfo } from "../models/runLoop/serverWithAdditionalInfo";

export async function main(ns: NS): Promise<void> {

    const result: ServerWithAdditionalInfo[] = []
    const serversToBeGottenWithPath = new Map<string, string[]>()
    const gottenServers: string[] = []

    serversToBeGottenWithPath.set("home", [])

    while (serversToBeGottenWithPath.size > 0) {
        const connection = serversToBeGottenWithPath.entries().next()

        const hostname = connection.value?.[0]
        const path = JSON.parse(JSON.stringify(connection.value?.[1])) as string[]

        const serverWithPath = ns.getServer(hostname) as ServerWithAdditionalInfo
        
        serverWithPath.freeRam = serverWithPath.maxRam - serverWithPath.ramUsed
        serverWithPath.path = path

        result.push(serverWithPath)



        gottenServers.push(hostname)
        serversToBeGottenWithPath.delete(hostname)

        const neighbors = ns.scan(hostname)

        for (const neighbor of neighbors) {
            if ((gottenServers.includes(neighbor) === false) && (serversToBeGottenWithPath.has(neighbor) === false)) {
                const newPath = JSON.parse(JSON.stringify(path)) as string[]
                newPath.push(neighbor)
                serversToBeGottenWithPath.set(neighbor, newPath)
            }
        }
    }

    const sortedByDifficultyResult = result
        .sort((a, b) => {
            const aSkill = a.requiredHackingSkill !== undefined ? a.requiredHackingSkill : 0
            const bSkill = b.requiredHackingSkill !== undefined ? b.requiredHackingSkill : 0
            return aSkill - bSkill
        })

    ns.write("/data/runLoop/environment.json", JSON.stringify(sortedByDifficultyResult), "w")
}