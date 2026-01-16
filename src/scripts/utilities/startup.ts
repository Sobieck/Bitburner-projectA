
import { NS } from "@ns";
import { Utilities } from "/scripts/utilities";
import { ServerWithAdditionalInfo } from "/scripts/models/runLoop/serverWithAdditionalInfo";
import { FilePaths } from "/scripts/constants";

export async function main(ns: NS): Promise<void> {

    const newEnvironment = ns.args[0] as string

    if (newEnvironment !== "install") {
        const environment = Utilities.readAndParse<ServerWithAdditionalInfo[]>(ns, FilePaths.data.environment)

        for (const server of environment.filter(x => x.hasAdminRights)) {
            ns.killall(server.hostname, true)
        }
    }

    const files = ns.ls("home", "data/")

    for (const file of files) {
        ns.rm(file)
    }

    ns.run("scripts/runLoop/orchestration.js")
}