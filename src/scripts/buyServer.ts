import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
    // ns.cloud.purchaseServer("CLOUD-00", 64)

    const cost = ns.getPurchasedServerCost(64)
    ns.tprint(cost)
}