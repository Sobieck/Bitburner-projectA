
import { NS } from "@ns";
import { Utilities } from "/scripts/utilities";
import { ServerWithAdditionalInfo } from "/scripts/models/runLoop/serverWithAdditionalInfo";
import { FilePaths } from "/scripts/constants";

export async function main(ns: NS): Promise<void> {

    const environment = Utilities.readAndParse<ServerWithAdditionalInfo[]>(ns, FilePaths.data.environment)

    for (const server of environment.filter(x => x.hasAdminRights)) {
        ns.killall(server.hostname, true)
    }
}