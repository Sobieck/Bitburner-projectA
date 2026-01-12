import { NS } from "@ns"
import { FilePaths } from "../../../../../src/scripts/constants"
import { main } from "../../../../../src/scripts/hacking/algorithms/prepareForBatch/pfb"
import { PrepareForBatchQueue, PrepareForBatchTarget } from "../../../../../src/scripts/models/hacking/algorithms/prepareForBatchTargets"
import { DispatchBatch, DispatchCommand, DispatchOrigin, DispatchQueue, DispatchType } from "../../../../../src/scripts/models/hacking/dispatch/dispatchQueue"
import { ServerWithAdditionalInfo, ThreadsNeeded } from "../../../../../src/scripts/models/runLoop/serverWithAdditionalInfo"
import { nsMock } from "../../../../utilities/nsMock.testUtility"
import { RandomValues } from "../../../../utilities/randomValues.testUtility"

describe('prepareForBatch algorithm', () => {
    let mockedNs = new nsMock()

    describe('there are undispatched jobs', () => {
        it('should not do anything', async () => {
            const nsSetup = new nsMock()

            nsSetup.readReturns.set(FilePaths.data.dispatchQueue, [JSON.stringify(
                new DispatchQueue([
                    new DispatchBatch(DispatchOrigin.Batch, "Something", [], true),
                    new DispatchBatch(DispatchOrigin.Junk, "Somf", [], false)
                ])
            )])


            const ns = nsSetup as unknown

            await main(ns as NS);

            mockedNs = ns as nsMock;

            expect(mockedNs.callOrder.length).toBe(1)
        })
    })

    describe('there is not enough capacity to run at all', () => {
        it("shouldn't do anything", async () => {
            const nsSetup = new nsMock()

            nsSetup.readReturns.set(FilePaths.data.dispatchQueue, [JSON.stringify(
                new DispatchQueue([
                    new DispatchBatch(DispatchOrigin.Batch, "Something", [], true),
                    new DispatchBatch(DispatchOrigin.Junk, "Somf", [], true)
                ])
            )])

            const environment = [
                {
                    possibleWeakenOrGrowThreads: 5,
                },
                {
                    possibleWeakenOrGrowThreads: 5,
                }
            ]

            nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify(environment)])

            const ns = nsSetup as unknown

            await main(ns as NS);

            mockedNs = ns as nsMock;

            expect(mockedNs.callOrder.length).toBe(2)
        })
    })

    describe('there are no current jobs', () => {
        it("should use the random value to pick from the availible servers", async () => {
            const nsSetup = new nsMock()

            const inQueueTargetWithPidsHostname = RandomValues.string()
            const inBatchProcessTargetHostnmae = RandomValues.string()

            const inQueueTargetWithPids = new PrepareForBatchTarget(inQueueTargetWithPidsHostname, 135, Date.now(), false, true, false)
            const inBatchProcessTarget = new PrepareForBatchTarget(inBatchProcessTargetHostnmae, 1350, Date.now() + 564, false, false, true)

            const prepareForBatchesQueue = new PrepareForBatchQueue(
                [
                    inQueueTargetWithPids,
                    inBatchProcessTarget,
                ]
            )

            nsSetup.readReturns.set(FilePaths.data.prepareForBatchQueue, [JSON.stringify(prepareForBatchesQueue)])

            nsSetup.readReturns.set(FilePaths.data.dispatchQueue, [JSON.stringify(new DispatchQueue([
                new DispatchBatch(DispatchOrigin.Batch, "Something", [], true),
                new DispatchBatch(DispatchOrigin.Junk, "Somf", [], true)
            ]))])

            const suffleWinnerHostName = RandomValues.string()
            const suffleWinnerMaxMoney = 59 + RandomValues.int()

            const threadsNeededFor1CoreWeaken = RandomValues.int()

            const threadsToReduceToMinDifficulty = [
                new ThreadsNeeded(2, 1029),
                new ThreadsNeeded(4, 5643),
                new ThreadsNeeded(1, threadsNeededFor1CoreWeaken)
            ]



            const environment = [
                {
                    hostname: inQueueTargetWithPidsHostname,
                    possibleWeakenOrGrowThreads: 5,
                    randomValueForShuffle: .99,
                    moneyMax: 100000,
                    hasAdminRights: true,
                },
                {
                    hostname: inBatchProcessTargetHostnmae,
                    possibleWeakenOrGrowThreads: 6,
                    randomValueForShuffle: .98,
                    moneyMax: 100000,
                    hasAdminRights: true,
                },
                {
                    hostname: "withNoMaxMoney",
                    randomValueForShuffle: .98,
                    hasAdminRights: true,
                },
                {
                    hostname: "withLowSuffle",
                    randomValueForShuffle: .5,
                    moneyMax: 10000000,
                    hasAdminRights: true,
                },
                {
                    hostname: suffleWinnerHostName,
                    randomValueForShuffle: .8,
                    moneyMax: suffleWinnerMaxMoney,
                    hasAdminRights: true,
                    minDifficulty: 2,
                    hackDifficulty: 10,
                    moneyAvailable: 58,
                    threadsToReduceToMinDifficulty: threadsToReduceToMinDifficulty,
                    threadsToHackMoneyAvailable: 1290,
                    threadsToIncreaseToMaxMoney: [],
                },
                {
                    hostname: "withLowSuffle2",
                    randomValueForShuffle: .4,
                    moneyMax: 100000000,
                    hasAdminRights: true,
                },
                {
                    hostname: "noAdminRights",
                    randomValueForShuffle: .97,
                    moneyMax: 10000020,
                    hasAdminRights: false,
                },
            ]

            nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify(environment)])

            const ns = nsSetup as unknown

            await main(ns as NS);

            mockedNs = ns as nsMock;

            expect(mockedNs.writeTuples[0][0]).toBe(FilePaths.data.dispatchQueue)
            expect(mockedNs.writeTuples[0][2]).toBe("w")
            expect(mockedNs.writeTuples[0][1]).toBe(JSON.stringify(
                new DispatchQueue([
                    new DispatchBatch(DispatchOrigin.Batch, "Something", [], true),
                    new DispatchBatch(DispatchOrigin.Junk, "Somf", [], true),
                    new DispatchBatch(DispatchOrigin.PrepareForBatch, suffleWinnerHostName, [
                        new DispatchCommand(threadsNeededFor1CoreWeaken, DispatchType.Weaken, 0, false, [], 0)
                    ])
                ])
            ))


            expect(mockedNs.writeTuples[1][0]).toBe(FilePaths.data.prepareForBatchQueue)
            expect(mockedNs.writeTuples[1][2]).toBe("w")


            const result = JSON.parse(mockedNs.writeTuples[1][1]) as PrepareForBatchQueue

            expect(result.targets[0].target).toBe(inBatchProcessTarget.target)
            expect(result.targets[0].targetsMoneyMax).toBe(inBatchProcessTarget.targetsMoneyMax)
            expect(result.targets[0].timeDispatched).toBe(inBatchProcessTarget.timeDispatched)
            expect(result.targets[0].waitForMoreThreads).toBe(inBatchProcessTarget.waitForMoreThreads)
            expect(result.targets[0].pidsActive).toBe(inBatchProcessTarget.pidsActive)
            expect(result.targets[0].inBatchProcess).toBe(inBatchProcessTarget.inBatchProcess)

            expect(result.targets[1].target).toBe(inQueueTargetWithPids.target)
            expect(result.targets[1].targetsMoneyMax).toBe(inQueueTargetWithPids.targetsMoneyMax)
            expect(result.targets[1].timeDispatched).toBe(inQueueTargetWithPids.timeDispatched)
            expect(result.targets[1].waitForMoreThreads).toBe(inQueueTargetWithPids.waitForMoreThreads)
            expect(result.targets[1].pidsActive).toBe(inQueueTargetWithPids.pidsActive)
            expect(result.targets[1].inBatchProcess).toBe(inQueueTargetWithPids.inBatchProcess)

            expect(result.targets[2].target).toBe(suffleWinnerHostName)
            expect(result.targets[2].targetsMoneyMax).toBe(suffleWinnerMaxMoney)
            expect(result.targets[2].timeDispatched).toBeGreaterThan(0)
            expect(result.targets[2].waitForMoreThreads).toBe(false)
            expect(result.targets[2].pidsActive).toBe(true)
            expect(result.targets[2].inBatchProcess).toBe(false)

        })
    })

    describe('there is not enough threads to meet demand for weakening, but there are less priority jobs with pids', () => {
        it("should issue not issue a weaken command and stop all progress", async () => {
            const nsSetup = new nsMock()

            const inQueueTargetWithPidsHostname = "inQueueTargetWithPidsHostname"
            const inBatchProcessTargetHostnmae = "inBatchProcessTargetHostnmae"
            const weakenTargetHostname = RandomValues.string()
            const lessMoneyPidsRunningHostname = "lessMoneyPidsRunning"
            const moreMoneyPidsRunningHostname = "moreMoneyPidsRunning"

            const moreMoneyPidsRunning = new PrepareForBatchTarget(moreMoneyPidsRunningHostname, 2000000001, Date.now(), false, true, false)
            const inQueueTargetWithPids = new PrepareForBatchTarget(inQueueTargetWithPidsHostname, 200000000, Date.now(), false, true, false)
            const needsWeakenTarget = new PrepareForBatchTarget(weakenTargetHostname, 100000000, Date.now(), false, false, false)
            const inBatchProcessTarget = new PrepareForBatchTarget(inBatchProcessTargetHostnmae, 1350, Date.now(), false, false, true)
            const lessMoneyPidsRunning = new PrepareForBatchTarget(lessMoneyPidsRunningHostname, 13, Date.now(), false, true, false)

            const prepareForBatchesQueue = new PrepareForBatchQueue(
                [
                    inBatchProcessTarget,
                    lessMoneyPidsRunning,
                    needsWeakenTarget,
                    inQueueTargetWithPids,
                    moreMoneyPidsRunning,
                ]
            )

            nsSetup.readReturns.set(FilePaths.data.prepareForBatchQueue, [JSON.stringify(prepareForBatchesQueue)])

            nsSetup.readReturns.set(FilePaths.data.dispatchQueue, [JSON.stringify(new DispatchQueue([
                new DispatchBatch(DispatchOrigin.Batch, "Something", [], true),
                new DispatchBatch(DispatchOrigin.Junk, "Somf", [], true),
            ]))])

            const environment = [
                {
                    hostname: inQueueTargetWithPidsHostname,
                    possibleWeakenOrGrowThreads: 5,
                    possibleHackThreads: 100,
                    randomValueForShuffle: .99,
                    moneyMax: 100000,
                    hasAdminRights: true,
                },
                {
                    hostname: inBatchProcessTargetHostnmae,
                    possibleWeakenOrGrowThreads: 19,
                    possibleHackThreads: 120,
                    randomValueForShuffle: .98,
                    moneyMax: 100000,
                    hasAdminRights: true,
                },
                {
                    hostname: "withNoMaxMoney",
                    randomValueForShuffle: .98,
                    hasAdminRights: true,
                },
                {
                    hostname: "withLowSuffle",
                    randomValueForShuffle: .5,
                    moneyMax: 10000000,
                    hasAdminRights: true,
                },
                {
                    hostname: "suffleWinnerHostName",
                    randomValueForShuffle: .8,
                    moneyMax: 46546,
                    hasAdminRights: true,
                    minDifficulty: 2,
                    hackDifficulty: 10,
                    moneyAvailable: 58,
                },
                {
                    hostname: weakenTargetHostname,
                    randomValueForShuffle: .4,
                    moneyMax: 100000000,
                    hasAdminRights: true,
                    threadsToHackMoneyAvailable: 221,
                    minDifficulty: 2,
                    hackDifficulty: 20,
                    moneyAvailable: 25,
                    threadsToReduceToMinDifficulty: [
                        new ThreadsNeeded(2, 120349),
                        new ThreadsNeeded(299, 354891),
                        new ThreadsNeeded(1, 25)
                    ],
                    threadsToIncreaseToMaxMoney: [
                        new ThreadsNeeded(2, 120349),
                        new ThreadsNeeded(299, 354891),
                        new ThreadsNeeded(1, 13)
                    ]
                },
                {
                    hostname: "noAdminRights",
                    randomValueForShuffle: .97,
                    moneyMax: 10000020,
                    hasAdminRights: false,
                },
            ]

            nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify(environment)])

            const ns = nsSetup as unknown

            await main(ns as NS);

            mockedNs = ns as nsMock;

            expect(mockedNs.writeTuples.length).toBe(1)


            expect(mockedNs.writeTuples[0][0]).toBe(FilePaths.data.prepareForBatchQueue)
            expect(mockedNs.writeTuples[0][2]).toBe("w")


            const result = JSON.parse(mockedNs.writeTuples[0][1]) as PrepareForBatchQueue

            expect(result.targets[0].target).toBe(moreMoneyPidsRunning.target)
            expect(result.targets[0].targetsMoneyMax).toBe(moreMoneyPidsRunning.targetsMoneyMax)
            expect(result.targets[0].timeDispatched).toBeGreaterThan(0)
            expect(result.targets[0].waitForMoreThreads).toBe(moreMoneyPidsRunning.waitForMoreThreads)
            expect(result.targets[0].pidsActive).toBe(moreMoneyPidsRunning.pidsActive)
            expect(result.targets[0].inBatchProcess).toBe(moreMoneyPidsRunning.inBatchProcess)

            expect(result.targets[1].target).toBe(inQueueTargetWithPids.target)
            expect(result.targets[1].targetsMoneyMax).toBe(inQueueTargetWithPids.targetsMoneyMax)
            expect(result.targets[1].timeDispatched).toBe(inQueueTargetWithPids.timeDispatched)
            expect(result.targets[1].waitForMoreThreads).toBe(inQueueTargetWithPids.waitForMoreThreads)
            expect(result.targets[1].pidsActive).toBe(inQueueTargetWithPids.pidsActive)
            expect(result.targets[1].inBatchProcess).toBe(inQueueTargetWithPids.inBatchProcess)

            expect(result.targets[2].target).toBe(needsWeakenTarget.target)
            expect(result.targets[2].targetsMoneyMax).toBe(needsWeakenTarget.targetsMoneyMax)
            expect(result.targets[2].timeDispatched).toBe(needsWeakenTarget.timeDispatched)
            expect(result.targets[2].waitForMoreThreads).toBe(true)
            expect(result.targets[2].pidsActive).toBe(needsWeakenTarget.pidsActive)
            expect(result.targets[2].inBatchProcess).toBe(needsWeakenTarget.inBatchProcess)

            expect(result.targets[3].target).toBe(inBatchProcessTarget.target)
            expect(result.targets[3].targetsMoneyMax).toBe(inBatchProcessTarget.targetsMoneyMax)
            expect(result.targets[3].timeDispatched).toBe(inBatchProcessTarget.timeDispatched)
            expect(result.targets[3].waitForMoreThreads).toBe(inBatchProcessTarget.waitForMoreThreads)
            expect(result.targets[3].pidsActive).toBe(inBatchProcessTarget.pidsActive)
            expect(result.targets[3].inBatchProcess).toBe(inBatchProcessTarget.inBatchProcess)

            expect(result.targets[4].target).toBe(lessMoneyPidsRunning.target)
            expect(result.targets[4].targetsMoneyMax).toBe(lessMoneyPidsRunning.targetsMoneyMax)
            expect(result.targets[4].timeDispatched).toBe(lessMoneyPidsRunning.timeDispatched)
            expect(result.targets[4].waitForMoreThreads).toBe(lessMoneyPidsRunning.waitForMoreThreads)
            expect(result.targets[4].pidsActive).toBe(lessMoneyPidsRunning.pidsActive)
            expect(result.targets[4].inBatchProcess).toBe(lessMoneyPidsRunning.inBatchProcess)
        })
    })

    describe('there are the is a job that needs hacking', () => {
        it("should issue a hacking command", async () => {
            const nsSetup = new nsMock()

            const inQueueTargetWithPidsHostname = RandomValues.string()
            const inBatchProcessTargetHostnmae = RandomValues.string()
            const hackingTargetHostname = RandomValues.string()

            const inQueueTargetWithPids = new PrepareForBatchTarget(inQueueTargetWithPidsHostname, 135, Date.now(), false, true, false)
            const inBatchProcessTarget = new PrepareForBatchTarget(inBatchProcessTargetHostnmae, 1350, Date.now() + 564, false, false, true)
            const needsHackingTarget = new PrepareForBatchTarget(hackingTargetHostname, 100000000, Date.now() + 1, true, false, false)

            const prepareForBatchesQueue = new PrepareForBatchQueue(
                [
                    inQueueTargetWithPids,
                    inBatchProcessTarget,
                    needsHackingTarget,
                ]
            )

            nsSetup.readReturns.set(FilePaths.data.prepareForBatchQueue, [JSON.stringify(prepareForBatchesQueue)])

            nsSetup.readReturns.set(FilePaths.data.dispatchQueue, [JSON.stringify(new DispatchQueue([
                new DispatchBatch(DispatchOrigin.Batch, "Something", [], true),
                new DispatchBatch(DispatchOrigin.Junk, "Somf", [], true),
            ]))])


            const threadsToHackMoneyAvailable = RandomValues.int(10000)


            const environment = [
                {
                    hostname: inQueueTargetWithPidsHostname,
                    possibleWeakenOrGrowThreads: 5,
                    randomValueForShuffle: .99,
                    moneyMax: 100000,
                    hasAdminRights: true,
                },
                {
                    hostname: inBatchProcessTargetHostnmae,
                    possibleWeakenOrGrowThreads: 6,
                    randomValueForShuffle: .98,
                    moneyMax: 100000,
                    hasAdminRights: true,
                },
                {
                    hostname: "withNoMaxMoney",
                    randomValueForShuffle: .98,
                    hasAdminRights: true,
                },
                {
                    hostname: "withLowSuffle",
                    randomValueForShuffle: .5,
                    moneyMax: 10000000,
                    hasAdminRights: true,
                },
                {
                    hostname: "suffleWinnerHostName",
                    randomValueForShuffle: .8,
                    moneyMax: 46546,
                    hasAdminRights: true,
                    minDifficulty: 2,
                    hackDifficulty: 10,
                    moneyAvailable: 58,
                },
                {
                    hostname: hackingTargetHostname,
                    randomValueForShuffle: .4,
                    moneyMax: 100000000,
                    hasAdminRights: true,
                    threadsToHackMoneyAvailable: threadsToHackMoneyAvailable,
                    minDifficulty: 2,
                    hackDifficulty: 2,
                    moneyAvailable: 100000000,
                    threadsToReduceToMinDifficulty: [],
                    threadsToIncreaseToMaxMoney: [],
                },
                {
                    hostname: "noAdminRights",
                    randomValueForShuffle: .97,
                    moneyMax: 10000020,
                    hasAdminRights: false,
                },
            ]

            nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify(environment)])

            const ns = nsSetup as unknown

            await main(ns as NS);

            mockedNs = ns as nsMock;

            expect(mockedNs.writeTuples[0][0]).toBe(FilePaths.data.dispatchQueue)
            expect(mockedNs.writeTuples[0][2]).toBe("w")
            expect(mockedNs.writeTuples[0][1]).toBe(JSON.stringify(
                new DispatchQueue([
                    new DispatchBatch(DispatchOrigin.Batch, "Something", [], true),
                    new DispatchBatch(DispatchOrigin.Junk, "Somf", [], true),
                    new DispatchBatch(DispatchOrigin.PrepareForBatch, hackingTargetHostname, [
                        new DispatchCommand(threadsToHackMoneyAvailable, DispatchType.Hack, 0, false, [], 0)
                    ])
                ])
            ))


            expect(mockedNs.writeTuples[1][0]).toBe(FilePaths.data.prepareForBatchQueue)
            expect(mockedNs.writeTuples[1][2]).toBe("w")


            const result = JSON.parse(mockedNs.writeTuples[1][1]) as PrepareForBatchQueue

            expect(result.targets[0].target).toBe(needsHackingTarget.target)
            expect(result.targets[0].targetsMoneyMax).toBe(needsHackingTarget.targetsMoneyMax)
            expect(result.targets[0].timeDispatched).toBeGreaterThan(0)
            expect(result.targets[0].waitForMoreThreads).toBe(false)
            expect(result.targets[0].pidsActive).toBe(true)
            expect(result.targets[0].inBatchProcess).toBe(false)

            expect(result.targets[1].target).toBe(inBatchProcessTarget.target)
            expect(result.targets[1].targetsMoneyMax).toBe(inBatchProcessTarget.targetsMoneyMax)
            expect(result.targets[1].timeDispatched).toBe(inBatchProcessTarget.timeDispatched)
            expect(result.targets[1].waitForMoreThreads).toBe(inBatchProcessTarget.waitForMoreThreads)
            expect(result.targets[1].pidsActive).toBe(inBatchProcessTarget.pidsActive)
            expect(result.targets[1].inBatchProcess).toBe(inBatchProcessTarget.inBatchProcess)

            expect(result.targets[2].target).toBe(inQueueTargetWithPids.target)
            expect(result.targets[2].targetsMoneyMax).toBe(inQueueTargetWithPids.targetsMoneyMax)
            expect(result.targets[2].timeDispatched).toBe(inQueueTargetWithPids.timeDispatched)
            expect(result.targets[2].waitForMoreThreads).toBe(inQueueTargetWithPids.waitForMoreThreads)
            expect(result.targets[2].pidsActive).toBe(inQueueTargetWithPids.pidsActive)
            expect(result.targets[2].inBatchProcess).toBe(inQueueTargetWithPids.inBatchProcess)
        })

        describe('and there is not enough threads to meet demand, but there are less priority jobs with pids', () => {
            it("should issue not issue a hack command and stop all progress", async () => {
                const nsSetup = new nsMock()

                const inQueueTargetWithPidsHostname = "inQueueTargetWithPidsHostname"
                const inBatchProcessTargetHostnmae = "inBatchProcessTargetHostnmae"
                const hackTargetHostname = RandomValues.string()
                const lessMoneyPidsRunningHostname = "lessMoneyPidsRunning"
                const moreMoneyPidsRunningHostname = "moreMoneyPidsRunning"

                const moreMoneyPidsRunning = new PrepareForBatchTarget(moreMoneyPidsRunningHostname, 2000000001, Date.now(), false, true, false)
                const inQueueTargetWithPids = new PrepareForBatchTarget(inQueueTargetWithPidsHostname, 200000000, Date.now(), false, true, false)
                const needsHackingTarget = new PrepareForBatchTarget(hackTargetHostname, 100000000, Date.now(), false, false, false)
                const inBatchProcessTarget = new PrepareForBatchTarget(inBatchProcessTargetHostnmae, 1350, Date.now(), false, false, true)
                const lessMoneyPidsRunning = new PrepareForBatchTarget(lessMoneyPidsRunningHostname, 13, Date.now(), false, true, false)

                const prepareForBatchesQueue = new PrepareForBatchQueue(
                    [
                        inBatchProcessTarget,
                        lessMoneyPidsRunning,
                        needsHackingTarget,
                        inQueueTargetWithPids,
                        moreMoneyPidsRunning,
                    ]
                )

                nsSetup.readReturns.set(FilePaths.data.prepareForBatchQueue, [JSON.stringify(prepareForBatchesQueue)])

                nsSetup.readReturns.set(FilePaths.data.dispatchQueue, [JSON.stringify(new DispatchQueue([
                    new DispatchBatch(DispatchOrigin.Batch, "Something", [], true),
                    new DispatchBatch(DispatchOrigin.Junk, "Somf", [], true),
                ]))])

                const environment = [
                    {
                        hostname: inQueueTargetWithPidsHostname,
                        possibleWeakenOrGrowThreads: 5,
                        possibleHackThreads: 100,
                        randomValueForShuffle: .99,
                        moneyMax: 100000,
                        hasAdminRights: true,
                    },
                    {
                        hostname: inBatchProcessTargetHostnmae,
                        possibleWeakenOrGrowThreads: 6,
                        possibleHackThreads: 120,
                        randomValueForShuffle: .98,
                        moneyMax: 100000,
                        hasAdminRights: true,
                    },
                    {
                        hostname: "withNoMaxMoney",
                        randomValueForShuffle: .98,
                        hasAdminRights: true,
                    },
                    {
                        hostname: "withLowSuffle",
                        randomValueForShuffle: .5,
                        moneyMax: 10000000,
                        hasAdminRights: true,
                    },
                    {
                        hostname: "suffleWinnerHostName",
                        randomValueForShuffle: .8,
                        moneyMax: 46546,
                        hasAdminRights: true,
                        minDifficulty: 2,
                        hackDifficulty: 10,
                        moneyAvailable: 58,
                    },
                    {
                        hostname: hackTargetHostname,
                        randomValueForShuffle: .4,
                        moneyMax: 100000000,
                        hasAdminRights: true,
                        threadsToHackMoneyAvailable: 221,
                        minDifficulty: 2,
                        hackDifficulty: 2,
                        moneyAvailable: 100000000,
                        threadsToReduceToMinDifficulty: [],
                        threadsToIncreaseToMaxMoney: [
                            new ThreadsNeeded(2, 120349),
                            new ThreadsNeeded(299, 354891),
                            new ThreadsNeeded(1, 13)
                        ]
                    },
                    {
                        hostname: "noAdminRights",
                        randomValueForShuffle: .97,
                        moneyMax: 10000020,
                        hasAdminRights: false,
                    },
                ]

                nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify(environment)])

                const ns = nsSetup as unknown

                await main(ns as NS);

                mockedNs = ns as nsMock;

                expect(mockedNs.writeTuples.length).toBe(1)


                expect(mockedNs.writeTuples[0][0]).toBe(FilePaths.data.prepareForBatchQueue)
                expect(mockedNs.writeTuples[0][2]).toBe("w")


                const result = JSON.parse(mockedNs.writeTuples[0][1]) as PrepareForBatchQueue

                expect(result.targets[0].target).toBe(moreMoneyPidsRunning.target)
                expect(result.targets[0].targetsMoneyMax).toBe(moreMoneyPidsRunning.targetsMoneyMax)
                expect(result.targets[0].timeDispatched).toBeGreaterThan(0)
                expect(result.targets[0].waitForMoreThreads).toBe(moreMoneyPidsRunning.waitForMoreThreads)
                expect(result.targets[0].pidsActive).toBe(moreMoneyPidsRunning.pidsActive)
                expect(result.targets[0].inBatchProcess).toBe(moreMoneyPidsRunning.inBatchProcess)

                expect(result.targets[1].target).toBe(inQueueTargetWithPids.target)
                expect(result.targets[1].targetsMoneyMax).toBe(inQueueTargetWithPids.targetsMoneyMax)
                expect(result.targets[1].timeDispatched).toBe(inQueueTargetWithPids.timeDispatched)
                expect(result.targets[1].waitForMoreThreads).toBe(inQueueTargetWithPids.waitForMoreThreads)
                expect(result.targets[1].pidsActive).toBe(inQueueTargetWithPids.pidsActive)
                expect(result.targets[1].inBatchProcess).toBe(inQueueTargetWithPids.inBatchProcess)

                expect(result.targets[2].target).toBe(needsHackingTarget.target)
                expect(result.targets[2].targetsMoneyMax).toBe(needsHackingTarget.targetsMoneyMax)
                expect(result.targets[2].timeDispatched).toBe(needsHackingTarget.timeDispatched)
                expect(result.targets[2].waitForMoreThreads).toBe(true)
                expect(result.targets[2].pidsActive).toBe(needsHackingTarget.pidsActive)
                expect(result.targets[2].inBatchProcess).toBe(needsHackingTarget.inBatchProcess)

                expect(result.targets[3].target).toBe(inBatchProcessTarget.target)
                expect(result.targets[3].targetsMoneyMax).toBe(inBatchProcessTarget.targetsMoneyMax)
                expect(result.targets[3].timeDispatched).toBe(inBatchProcessTarget.timeDispatched)
                expect(result.targets[3].waitForMoreThreads).toBe(inBatchProcessTarget.waitForMoreThreads)
                expect(result.targets[3].pidsActive).toBe(inBatchProcessTarget.pidsActive)
                expect(result.targets[3].inBatchProcess).toBe(inBatchProcessTarget.inBatchProcess)

                expect(result.targets[4].target).toBe(lessMoneyPidsRunning.target)
                expect(result.targets[4].targetsMoneyMax).toBe(lessMoneyPidsRunning.targetsMoneyMax)
                expect(result.targets[4].timeDispatched).toBe(lessMoneyPidsRunning.timeDispatched)
                expect(result.targets[4].waitForMoreThreads).toBe(lessMoneyPidsRunning.waitForMoreThreads)
                expect(result.targets[4].pidsActive).toBe(lessMoneyPidsRunning.pidsActive)
                expect(result.targets[4].inBatchProcess).toBe(lessMoneyPidsRunning.inBatchProcess)
            })
        })
    })

    describe('there are the is a job that needs growing', () => {
        describe('and there is not enough threads to meet demand, but there are less priority jobs with pids', () => {
            it("should issue not issue a grow command and stop all progress", async () => {
                const nsSetup = new nsMock()

                const inQueueTargetWithPidsHostname = "inQueueTargetWithPidsHostname"
                const inBatchProcessTargetHostnmae = "inBatchProcessTargetHostnmae"
                const growTargetHostname = RandomValues.string()
                const lessMoneyPidsRunningHostname = "lessMoneyPidsRunning"
                const moreMoneyPidsRunningHostname = "moreMoneyPidsRunning"

                const moreMoneyPidsRunning = new PrepareForBatchTarget(moreMoneyPidsRunningHostname, 2000000001, Date.now(), false, true, false)
                const inQueueTargetWithPids = new PrepareForBatchTarget(inQueueTargetWithPidsHostname, 200000000, Date.now(), false, true, false)
                const needsGrowingTarget = new PrepareForBatchTarget(growTargetHostname, 100000000, Date.now(), false, false, false)
                const inBatchProcessTarget = new PrepareForBatchTarget(inBatchProcessTargetHostnmae, 1350, Date.now(), false, false, true)
                const lessMoneyPidsRunning = new PrepareForBatchTarget(lessMoneyPidsRunningHostname, 13, Date.now(), false, true, false)

                const prepareForBatchesQueue = new PrepareForBatchQueue(
                    [
                        inBatchProcessTarget,
                        lessMoneyPidsRunning,
                        needsGrowingTarget,
                        inQueueTargetWithPids,
                        moreMoneyPidsRunning,
                    ]
                )

                nsSetup.readReturns.set(FilePaths.data.prepareForBatchQueue, [JSON.stringify(prepareForBatchesQueue)])

                nsSetup.readReturns.set(FilePaths.data.dispatchQueue, [JSON.stringify(new DispatchQueue([
                    new DispatchBatch(DispatchOrigin.Batch, "Something", [], true),
                    new DispatchBatch(DispatchOrigin.Junk, "Somf", [], true),
                ]))])

                const environment = [
                    {
                        hostname: inQueueTargetWithPidsHostname,
                        possibleWeakenOrGrowThreads: 5,
                        randomValueForShuffle: .99,
                        moneyMax: 100000,
                        hasAdminRights: true,
                    },
                    {
                        hostname: inBatchProcessTargetHostnmae,
                        possibleWeakenOrGrowThreads: 6,
                        randomValueForShuffle: .98,
                        moneyMax: 100000,
                        hasAdminRights: true,
                    },
                    {
                        hostname: "withNoMaxMoney",
                        randomValueForShuffle: .98,
                        hasAdminRights: true,
                    },
                    {
                        hostname: "withLowSuffle",
                        randomValueForShuffle: .5,
                        moneyMax: 10000000,
                        hasAdminRights: true,
                    },
                    {
                        hostname: "suffleWinnerHostName",
                        randomValueForShuffle: .8,
                        moneyMax: 46546,
                        hasAdminRights: true,
                        minDifficulty: 2,
                        hackDifficulty: 10,
                        moneyAvailable: 58,
                    },
                    {
                        hostname: growTargetHostname,
                        randomValueForShuffle: .4,
                        moneyMax: 100000000,
                        hasAdminRights: true,
                        threadsToHackMoneyAvailable: 45613,
                        minDifficulty: 2,
                        hackDifficulty: 2,
                        moneyAvailable: 8000,
                        threadsToReduceToMinDifficulty: [],
                        threadsToIncreaseToMaxMoney: [
                            new ThreadsNeeded(2, 120349),
                            new ThreadsNeeded(299, 354891),
                            new ThreadsNeeded(1, 13)
                        ]
                    },
                    {
                        hostname: "noAdminRights",
                        randomValueForShuffle: .97,
                        moneyMax: 10000020,
                        hasAdminRights: false,
                    },
                ]

                nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify(environment)])

                const ns = nsSetup as unknown

                await main(ns as NS);

                mockedNs = ns as nsMock;

                expect(mockedNs.writeTuples.length).toBe(1)


                expect(mockedNs.writeTuples[0][0]).toBe(FilePaths.data.prepareForBatchQueue)
                expect(mockedNs.writeTuples[0][2]).toBe("w")


                const result = JSON.parse(mockedNs.writeTuples[0][1]) as PrepareForBatchQueue

                expect(result.targets[0].target).toBe(moreMoneyPidsRunning.target)
                expect(result.targets[0].targetsMoneyMax).toBe(moreMoneyPidsRunning.targetsMoneyMax)
                expect(result.targets[0].timeDispatched).toBeGreaterThan(0)
                expect(result.targets[0].waitForMoreThreads).toBe(moreMoneyPidsRunning.waitForMoreThreads)
                expect(result.targets[0].pidsActive).toBe(moreMoneyPidsRunning.pidsActive)
                expect(result.targets[0].inBatchProcess).toBe(moreMoneyPidsRunning.inBatchProcess)

                expect(result.targets[1].target).toBe(inQueueTargetWithPids.target)
                expect(result.targets[1].targetsMoneyMax).toBe(inQueueTargetWithPids.targetsMoneyMax)
                expect(result.targets[1].timeDispatched).toBe(inQueueTargetWithPids.timeDispatched)
                expect(result.targets[1].waitForMoreThreads).toBe(inQueueTargetWithPids.waitForMoreThreads)
                expect(result.targets[1].pidsActive).toBe(inQueueTargetWithPids.pidsActive)
                expect(result.targets[1].inBatchProcess).toBe(inQueueTargetWithPids.inBatchProcess)

                expect(result.targets[2].target).toBe(needsGrowingTarget.target)
                expect(result.targets[2].targetsMoneyMax).toBe(needsGrowingTarget.targetsMoneyMax)
                expect(result.targets[2].timeDispatched).toBe(needsGrowingTarget.timeDispatched)
                expect(result.targets[2].waitForMoreThreads).toBe(true)
                expect(result.targets[2].pidsActive).toBe(needsGrowingTarget.pidsActive)
                expect(result.targets[2].inBatchProcess).toBe(needsGrowingTarget.inBatchProcess)

                expect(result.targets[3].target).toBe(inBatchProcessTarget.target)
                expect(result.targets[3].targetsMoneyMax).toBe(inBatchProcessTarget.targetsMoneyMax)
                expect(result.targets[3].timeDispatched).toBe(inBatchProcessTarget.timeDispatched)
                expect(result.targets[3].waitForMoreThreads).toBe(inBatchProcessTarget.waitForMoreThreads)
                expect(result.targets[3].pidsActive).toBe(inBatchProcessTarget.pidsActive)
                expect(result.targets[3].inBatchProcess).toBe(inBatchProcessTarget.inBatchProcess)

                expect(result.targets[4].target).toBe(lessMoneyPidsRunning.target)
                expect(result.targets[4].targetsMoneyMax).toBe(lessMoneyPidsRunning.targetsMoneyMax)
                expect(result.targets[4].timeDispatched).toBe(lessMoneyPidsRunning.timeDispatched)
                expect(result.targets[4].waitForMoreThreads).toBe(lessMoneyPidsRunning.waitForMoreThreads)
                expect(result.targets[4].pidsActive).toBe(lessMoneyPidsRunning.pidsActive)
                expect(result.targets[4].inBatchProcess).toBe(lessMoneyPidsRunning.inBatchProcess)
            })
        })

        it("should issue a growing command", async () => {
            const nsSetup = new nsMock()

            const inQueueTargetWithPidsHostname = "inQueueTargetWithPids"
            const inBatchProcessTargetHostnmae = RandomValues.string()
            const growTargetHostname = RandomValues.string()

            const inQueueTargetWithPids = new PrepareForBatchTarget(inQueueTargetWithPidsHostname, 100000003, Date.now(), false, true, false)
            const inBatchProcessTarget = new PrepareForBatchTarget(inBatchProcessTargetHostnmae, 1350, Date.now() + 564, false, false, true)
            const needsGrowingTarget = new PrepareForBatchTarget(growTargetHostname, 100000000, Date.now() + 1, true, false, false)

            const prepareForBatchesQueue = new PrepareForBatchQueue(
                [
                    inQueueTargetWithPids,
                    inBatchProcessTarget,
                    needsGrowingTarget,
                ]
            )

            nsSetup.readReturns.set(FilePaths.data.prepareForBatchQueue, [JSON.stringify(prepareForBatchesQueue)])

            nsSetup.readReturns.set(FilePaths.data.dispatchQueue, [JSON.stringify(new DispatchQueue([
                new DispatchBatch(DispatchOrigin.Batch, "Something", [], true),
                new DispatchBatch(DispatchOrigin.Junk, "Somf", [], true)
            ]))])


            const threadsToGrowMoneyAvailable = RandomValues.int(10000)


            const environment = [
                {
                    hostname: inQueueTargetWithPidsHostname,
                    possibleWeakenOrGrowThreads: 5,
                    randomValueForShuffle: .99,
                    moneyMax: 100000,
                    hasAdminRights: true,
                },
                {
                    hostname: inBatchProcessTargetHostnmae,
                    possibleWeakenOrGrowThreads: 6,
                    randomValueForShuffle: .98,
                    moneyMax: 100000,
                    hasAdminRights: true,
                },
                {
                    hostname: "withNoMaxMoney",
                    randomValueForShuffle: .98,
                    hasAdminRights: true,
                },
                {
                    hostname: "withLowSuffle",
                    randomValueForShuffle: .5,
                    moneyMax: 10000000,
                    hasAdminRights: true,
                },
                {
                    hostname: "suffleWinnerHostName",
                    randomValueForShuffle: .8,
                    moneyMax: 46546,
                    hasAdminRights: true,
                    minDifficulty: 2,
                    hackDifficulty: 10,
                    moneyAvailable: 58,
                },
                {
                    hostname: growTargetHostname,
                    randomValueForShuffle: .4,
                    moneyMax: 100000000,
                    hasAdminRights: true,
                    threadsToHackMoneyAvailable: 45613,
                    minDifficulty: 2,
                    hackDifficulty: 2,
                    moneyAvailable: 8000,
                    threadsToReduceToMinDifficulty: [],
                    threadsToIncreaseToMaxMoney: [
                        new ThreadsNeeded(2, 120349),
                        new ThreadsNeeded(299, 354891),
                        new ThreadsNeeded(1, threadsToGrowMoneyAvailable)
                    ]
                },
                {
                    hostname: "noAdminRights",
                    randomValueForShuffle: .97,
                    moneyMax: 10000020,
                    hasAdminRights: false,
                },
            ]

            nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify(environment)])

            const ns = nsSetup as unknown

            await main(ns as NS);

            mockedNs = ns as nsMock;

            expect(mockedNs.writeTuples[0][0]).toBe(FilePaths.data.dispatchQueue)
            expect(mockedNs.writeTuples[0][2]).toBe("w")
            expect(mockedNs.writeTuples[0][1]).toBe(JSON.stringify(
                new DispatchQueue([
                    new DispatchBatch(DispatchOrigin.Batch, "Something", [], true),
                    new DispatchBatch(DispatchOrigin.Junk, "Somf", [], true),
                    new DispatchBatch(DispatchOrigin.PrepareForBatch, growTargetHostname, [
                        new DispatchCommand(threadsToGrowMoneyAvailable, DispatchType.Grow, 0, false, [], 0)
                    ])
                ])
            ))


            expect(mockedNs.writeTuples[1][0]).toBe(FilePaths.data.prepareForBatchQueue)
            expect(mockedNs.writeTuples[1][2]).toBe("w")


            const result = JSON.parse(mockedNs.writeTuples[1][1]) as PrepareForBatchQueue

            expect(result.targets[1].target).toBe(needsGrowingTarget.target)
            expect(result.targets[1].targetsMoneyMax).toBe(needsGrowingTarget.targetsMoneyMax)
            expect(result.targets[1].timeDispatched).toBeGreaterThan(0)
            expect(result.targets[1].waitForMoreThreads).toBe(false)
            expect(result.targets[1].pidsActive).toBe(true)
            expect(result.targets[1].inBatchProcess).toBe(false)

            expect(result.targets[2].target).toBe(inBatchProcessTarget.target)
            expect(result.targets[2].targetsMoneyMax).toBe(inBatchProcessTarget.targetsMoneyMax)
            expect(result.targets[2].timeDispatched).toBe(inBatchProcessTarget.timeDispatched)
            expect(result.targets[2].waitForMoreThreads).toBe(inBatchProcessTarget.waitForMoreThreads)
            expect(result.targets[2].pidsActive).toBe(inBatchProcessTarget.pidsActive)
            expect(result.targets[2].inBatchProcess).toBe(inBatchProcessTarget.inBatchProcess)

            expect(result.targets[0].target).toBe(inQueueTargetWithPids.target)
            expect(result.targets[0].targetsMoneyMax).toBe(inQueueTargetWithPids.targetsMoneyMax)
            expect(result.targets[0].timeDispatched).toBe(inQueueTargetWithPids.timeDispatched)
            expect(result.targets[0].waitForMoreThreads).toBe(inQueueTargetWithPids.waitForMoreThreads)
            expect(result.targets[0].pidsActive).toBe(inQueueTargetWithPids.pidsActive)
            expect(result.targets[0].inBatchProcess).toBe(inQueueTargetWithPids.inBatchProcess)
        })
    })
})