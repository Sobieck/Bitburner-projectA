
import { NS } from "@ns";

import { FilePaths } from "/scripts/constants";
import { ServerWithAdditionalInfo } from "/scripts/models/runLoop/serverWithAdditionalInfo";
import { Utilities } from "/scripts/utilities";

export async function main(ns: NS): Promise<void> {

    const environment = Utilities.readAndParse<ServerWithAdditionalInfo[]>(ns, FilePaths.data.environment)

    const totalPossibleThreads = environment
        .filter(x => x.hasAdminRights)
        .reduce((x, y) => x + y.possibleWeakenOrGrowThreads, 0)

    ns.tprint(totalPossibleThreads)

}