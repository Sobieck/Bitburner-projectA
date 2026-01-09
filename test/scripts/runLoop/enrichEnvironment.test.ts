import { main } from "../../../src/scripts/runLoop/enrichEnvironment"
import { NS } from "@ns";
import { nsMock } from "../../utilities/nsMock.testUtility";
import { ScriptRamCost } from "../../../src/scripts/models/runLoop/scriptRamCost"
import { FilePaths } from "../../../src/scripts/constants"
import { ServerWithAdditionalInfo } from "../../../src/scripts/models/runLoop/serverWithAdditionalInfo"

describe('enrichEnvironment', () => {

    const home = {
        hostname: "home",
        freeRam: 100,
        maxRam: 100,
    }

    const server1 = {
        hostname: "server1",
        freeRam: 1000,
        maxRam: 20000,
    }

    const server2 = {
        hostname: "server2",
        freeRam: 1.69,
        maxRam: 0
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

        const savedEvironment = JSON.parse(mockedNs.writeTuples[0][1]) as ServerWithAdditionalInfo[]

        const expectedResults = [
            {
                hostname: server1.hostname,
                freeRam: 1000,
                reservedRam: 0,
                maxRam: 20000,
                possibleWeakenOrGrowThreads: 571,
                possibleHackThreads: 588,
                maxWeakenOrGrowThreads: 11428,
                maxHackThreads: 11764,
            },
            {
                hostname: home.hostname,
                freeRam: 100,
                reservedRam: 19,
                maxRam: 100,
                possibleWeakenOrGrowThreads: 46,
                possibleHackThreads: 47,
                maxWeakenOrGrowThreads: 46,
                maxHackThreads: 47,
            },
            {
                hostname: server2.hostname,
                freeRam: 1.69,
                reservedRam: 0,
                maxRam: 0,
                possibleWeakenOrGrowThreads: 0,
                possibleHackThreads: 0,
                maxWeakenOrGrowThreads: 0,
                maxHackThreads: 0,
            },
        ]

        asserts(expectedResults, savedEvironment);

    })

    it("should reserve 2x orchestrator when orchestrator is the costliest runLoop script", async () => {
        scriptRamCosts.push(new ScriptRamCost(FilePaths.scripts.orchestration, 11.1))

        nsSetup.readReturns.set(FilePaths.data.scriptRamCost, [JSON.stringify(scriptRamCosts)])

        const ns = nsSetup as unknown

        await main(ns as NS);

        const mockedNs = ns as nsMock;

        const expectedResults =
            [
                {
                    hostname: server1.hostname,
                    freeRam: 1000,
                    reservedRam: 0,
                    maxRam: 20000,
                    possibleWeakenOrGrowThreads: 571,
                    possibleHackThreads: 588,
                    maxWeakenOrGrowThreads: 11428,
                    maxHackThreads: 11764,
                },
                {
                    hostname: home.hostname,
                    freeRam: 100,
                    reservedRam: 24,
                    maxRam: 100,
                    possibleWeakenOrGrowThreads: 43,
                    possibleHackThreads: 44,
                    maxWeakenOrGrowThreads: 43,
                    maxHackThreads: 44,
                },
                {
                    hostname: server2.hostname,
                    freeRam: 1.69,
                    reservedRam: 0,
                    maxRam: 0,
                    possibleWeakenOrGrowThreads: 0,
                    possibleHackThreads: 0,
                    maxWeakenOrGrowThreads: 0,
                    maxHackThreads: 0,
                },
            ]

        const savedEvironment = JSON.parse(mockedNs.writeTuples[0][1]) as ServerWithAdditionalInfo[]

        expect(mockedNs.writeTuples[0][0]).toBe(FilePaths.data.environment)
        expect(mockedNs.writeTuples[0][2]).toBe("w")

        asserts(expectedResults, savedEvironment)
    })
})

function asserts(expectedResults: { hostname: string; freeRam: number; reservedRam: number; possibleWeakenOrGrowThreads: number; possibleHackThreads: number; maxWeakenOrGrowThreads: number; maxHackThreads: number; }[], savedEvironment: ServerWithAdditionalInfo[]) {
    for (let i = 0; i < expectedResults.length; i++) {
        const expectedResult = expectedResults[i];
        const actualResult = savedEvironment[i];

        expect(actualResult.randomValueForShuffle).toBeGreaterThan(0);

        expect(actualResult.hostname).toBe(expectedResult.hostname);
        expect(actualResult.freeRam).toBe(expectedResult.freeRam);
        expect(actualResult.reservedRam).toBe(expectedResult.reservedRam);
        expect(actualResult.possibleWeakenOrGrowThreads).toBe(expectedResult.possibleWeakenOrGrowThreads);
        expect(actualResult.possibleHackThreads).toBe(expectedResult.possibleHackThreads);
        expect(actualResult.maxWeakenOrGrowThreads).toBe(expectedResult.maxWeakenOrGrowThreads);
        expect(actualResult.maxHackThreads).toBe(expectedResult.maxHackThreads);
    }
}
