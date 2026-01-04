
import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {

    // ns.exec("/scr/scripts/hacking/hack.js", "host", "threads", "target", "additionalMsec", "effectStock")

    const target = ns.args[0] as string
    const additionalMsec = ns.args[1] as number
    const stock = ns.args[2] as boolean


    await ns.hack(target, { additionalMsec: additionalMsec, stock: stock })
}