import { main } from "../../../src/scripts/runLoop/enrichEnvironmentForHacking"
import { NS } from "@ns";
import { nsMock } from "../../utilities/nsMock.testUtility";
import { FilePaths } from "../../../src/scripts/constants"
import { ServerWithAdditionalInfo, ThreadsNeeded } from "../../../src/scripts/models/runLoop/serverWithAdditionalInfo"
import { RandomValues } from "../../utilities/randomValues.testUtility";

describe('enrichEnvironmentForHacking', () => {

    const home = {
        hostname: "home",
        purchasedByPlayer: true,
        cpuCores: 5,
    }

    const server1 = {
        hostname: "server1",
        purchasedByPlayer: false,
        cpuCores: 8,
        moneyMax: 1000,
        moneyAvailable: 900,
        minDifficulty: 9,
        hackDifficulty: 19,
    }

    const server2 = {
        hostname: "server2",
        purchasedByPlayer: false,
        cpuCores: 2,
        moneyMax: 2000,
        moneyAvailable: 100,
        minDifficulty: 90,
        hackDifficulty: 190,
    }



    let mockedNs = new nsMock()

    const server1HackTime = RandomValues.int()
    const server2HackTime = RandomValues.int()

    const server1WeakenTime = RandomValues.int()
    const server2WeakenTime = RandomValues.int()

    const server1GrowTime = RandomValues.int()
    const server2GrowTime = RandomValues.int()



    const server1MaxMoneyThreads = RandomValues.int()
    const server2MaxMoneyThreads = RandomValues.int()

    const server1CurrentMoneyThreads = RandomValues.int()
    const server2CurrentMoneyThreads = RandomValues.int()



    beforeEach(async () => {
        const nsSetup = new nsMock()


        const environment = [
            server1,
            home,
            server2
        ]

        nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify(environment)])

        nsSetup.getHackTimeReturns.set(server1.hostname, server1HackTime)
        nsSetup.getHackTimeReturns.set(server2.hostname, server2HackTime)

        nsSetup.getWeakenTimeReturns.set(server1.hostname, server1WeakenTime)
        nsSetup.getWeakenTimeReturns.set(server2.hostname, server2WeakenTime)

        nsSetup.getGrowTimeReturns.set(server1.hostname, server1GrowTime)
        nsSetup.getGrowTimeReturns.set(server2.hostname, server2GrowTime)

        nsSetup.hackAnalyzeThreadsReturns.set(server1.hostname + (server1.moneyAvailable - (server1.moneyMax * 0.05)), server1CurrentMoneyThreads + .01)
        nsSetup.hackAnalyzeThreadsReturns.set(server2.hostname + (server2.moneyAvailable - (server2.moneyMax * 0.05)), server2CurrentMoneyThreads)


        const ns = nsSetup as unknown

        await main(ns as NS);

        mockedNs = ns as nsMock;
    })


    it("should add a reserved property to every server, and reserve space on home", async () => {
        expect(mockedNs.writeTuples[0][0]).toBe(FilePaths.data.environment)
        expect(mockedNs.writeTuples[0][2]).toBe("w")

        expect(mockedNs.writeTuples[0][1]).toBe(JSON.stringify(
            [
                {
                    hostname: "server1",
                    purchasedByPlayer: false,
                    cpuCores: 8,
                    moneyMax: server1.moneyMax,
                    moneyAvailable: server1.moneyAvailable,
                    minDifficulty: 9,
                    hackDifficulty: 19,

                    hackTime: server1HackTime,
                    weakenTime: server1WeakenTime,
                    growTime: server1GrowTime,

                    threadsToHackMoneyAvailable: server1CurrentMoneyThreads + 5 + 1,

                    threadsToReduceToMinDifficulty: [
                        new ThreadsNeeded(1, 910 + 5),
                        new ThreadsNeeded(2, 455 + 5),
                        new ThreadsNeeded(3, 304 + 5),
                        new ThreadsNeeded(4, 228 + 5),
                        new ThreadsNeeded(5, 182 + 5),
                        new ThreadsNeeded(6, 152 + 5),
                        new ThreadsNeeded(7, 130 + 5),
                        new ThreadsNeeded(8, 114 + 5),
                    ],

                    threadsToIncreaseToMaxMoney: [
                        new ThreadsNeeded(1, 4 + 5),
                        new ThreadsNeeded(2, 5 + 5),
                        new ThreadsNeeded(3, 6 + 5),
                        new ThreadsNeeded(4, 7 + 5),
                        new ThreadsNeeded(5, 8 + 5),
                        new ThreadsNeeded(6, 9 + 5),
                        new ThreadsNeeded(7, 10 + 5),
                        new ThreadsNeeded(8, 11 + 5),
                    ]
                },
                {
                    hostname: "home",
                    purchasedByPlayer: true,
                    cpuCores: 5,
                },
                {
                    hostname: "server2",
                    purchasedByPlayer: false,
                    cpuCores: 2,
                    moneyMax: server2.moneyMax,
                    moneyAvailable: server2.moneyAvailable,
                    minDifficulty: 90,
                    hackDifficulty: 190,

                    hackTime: server2HackTime,
                    weakenTime: server2WeakenTime,
                    growTime: server2GrowTime,

                    threadsToHackMoneyAvailable: server2CurrentMoneyThreads + 5,

                    threadsToReduceToMinDifficulty: [
                        new ThreadsNeeded(1, 9091 + 5),
                        new ThreadsNeeded(2, 4546 + 5),
                        new ThreadsNeeded(3, 3031 + 5),
                        new ThreadsNeeded(4, 2273 + 5),
                        new ThreadsNeeded(5, 1819 + 5),
                        new ThreadsNeeded(6, 1516 + 5),
                        new ThreadsNeeded(7, 1299 + 5),
                        new ThreadsNeeded(8, 1137 + 5),
                    ],

                    threadsToIncreaseToMaxMoney: [
                        new ThreadsNeeded(1, 23 + 5),
                        new ThreadsNeeded(2, 24 + 5),
                        new ThreadsNeeded(3, 25 + 5),
                        new ThreadsNeeded(4, 26 + 5),
                        new ThreadsNeeded(5, 27 + 5),
                        new ThreadsNeeded(6, 28 + 5),
                        new ThreadsNeeded(7, 29 + 5),
                        new ThreadsNeeded(8, 30 + 5),
                    ],
                },
            ]
        ))
    })
})