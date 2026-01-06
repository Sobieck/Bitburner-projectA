import { main } from "../../../src/scripts/runLoop/enrichEnvironment"
import { NS } from "@ns";
import { nsMock } from "../../utilities/nsMock.testUtility";
import { ScriptRamCost } from "../../../src/scripts/models/runLoop/scriptRamCost"
import { FilePaths } from "../../../src/scripts/models/filePaths"
import { freemem } from "os";

describe('enrichEnvironment', () => {

    const home = {
        hostname: "home",
        freeRam: 100
    }

    const server1 = {
        hostname: "server1",
        freeRam: 1000
    }

    const server2 = {
        hostname: "server2",
        freeRam: 1.69
    }

    const script1 = "scripts1" // lower not run loop
    const script2 = "script2" // run loop lowest
    const script3 = "script3" // most run loop
    const script4 = "script4" // most - not run loop

    let nsSetup: nsMock;
    let scriptRamCosts: ScriptRamCost[] = []
    let environment: { hostname: string }[] = []
    let runLoop: string[] = []

    beforeEach(async () => {
        nsSetup = new nsMock()

        scriptRamCosts = [
            new ScriptRamCost(script1, 1),
            new ScriptRamCost(script2, 3),
            new ScriptRamCost(script3, 9.2),
            new ScriptRamCost(script4, 100)
        ]

        environment = [
            server1,
            home,
            server2
        ]

        runLoop = [
            script2,
            script3
        ]

        nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify(environment)])
        nsSetup.readReturns.set(FilePaths.data.scriptsToRun, [JSON.stringify(runLoop)])
    })


    it("should add a reserved property to every server, and reserve space on home", async () => {
        scriptRamCosts.push(new ScriptRamCost(FilePaths.scripts.orchestration, 8.1))

        nsSetup.readReturns.set(FilePaths.data.scriptRamCost, [JSON.stringify(scriptRamCosts)])

        const ns = nsSetup as unknown

        await main(ns as NS);

        const mockedNs = ns as nsMock;

        expect(mockedNs.writeTuples[0][0]).toBe(FilePaths.data.environment)
        expect(mockedNs.writeTuples[0][2]).toBe("w")
        expect(mockedNs.writeTuples[0][1]).toBe(JSON.stringify(
            [
                {
                    hostname: server1.hostname,
                    freeRam: 1000,
                    reservedRam: 0,
                    possibleWeakenOrGrowThreads: 571,
                    possibleHackThreads: 588,
                },
                {
                    hostname: home.hostname,
                    freeRam: 100,
                    reservedRam: 19,
                    possibleWeakenOrGrowThreads: 46,
                    possibleHackThreads: 47,
                },
                {
                    hostname: server2.hostname,
                    freeRam: 1.69,
                    reservedRam: 0,
                    possibleWeakenOrGrowThreads: 0,
                    possibleHackThreads: 0,
                },
            ]
        ))
    })

    it("should reserve 2x orchestrator when orchestrator is the costliest runLoop script", async () => {
        scriptRamCosts.push(new ScriptRamCost(FilePaths.scripts.orchestration, 11.1))

        nsSetup.readReturns.set(FilePaths.data.scriptRamCost, [JSON.stringify(scriptRamCosts)])

        const ns = nsSetup as unknown

        await main(ns as NS);

        const mockedNs = ns as nsMock;

        expect(mockedNs.writeTuples[0][0]).toBe(FilePaths.data.environment)
        expect(mockedNs.writeTuples[0][2]).toBe("w")
        expect(mockedNs.writeTuples[0][1]).toBe(JSON.stringify(
            [
                {
                    hostname: server1.hostname,
                    freeRam: 1000,
                    reservedRam: 0,
                    possibleWeakenOrGrowThreads: 571,
                    possibleHackThreads: 588,
                },
                {
                    hostname: home.hostname,
                    freeRam: 100,
                    reservedRam: 24,
                    possibleWeakenOrGrowThreads: 43,
                    possibleHackThreads: 44,
                },
                {
                    hostname: server2.hostname,
                    freeRam: 1.69,
                    reservedRam: 0,
                    possibleWeakenOrGrowThreads: 0,
                    possibleHackThreads: 0,
                },
            ]
        ))
    })
})