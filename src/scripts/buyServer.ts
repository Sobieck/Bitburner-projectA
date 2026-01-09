import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
    // ns.cloud.purchaseServer("CLOUD-00", 64)

    const cost = ns.cloud.getServerCost(128)
    ns.tprint(cost)
}