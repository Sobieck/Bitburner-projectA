
import { NS } from "@ns";
import { FilePaths } from "/scripts/models/filePaths";
import { DispatchCommand } from "/scripts/models/hacking/dispatch/dispatchQueue";

export async function main(ns: NS): Promise<void> {

    const dispatchQueue = JSON.parse(ns.read(FilePaths.data.dispatchQueue)) as DispatchCommand[]

    // const unexecCommands = dispatchQueue.filter(x => x.pid !== undefined)

    // // select servers to execute commands on
    // for (const unexecCommand of unexecCommands) {
    // }
}