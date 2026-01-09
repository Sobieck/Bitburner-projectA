import { main } from "../../../../src/scripts/hacking/dispatch/dispatcher"
import { NS } from "@ns"
import { nsMock } from "../../../utilities/nsMock.testUtility"
import { DispatchBatch, DispatchCommand, DispatchOrigin, DispatchQueue, DispatchType } from "../../../../src/scripts/models/hacking/dispatch/dispatchQueue"
import { RandomValues } from "../../../utilities/randomValues.testUtility"
import { FilePaths } from "../../../../src/scripts/constants"
import { ThreadsNeeded } from "../../../../src/scripts/models/runLoop/serverWithAdditionalInfo"

describe('dispatcher', () => {


    const randomValues = new RandomValues()

    const command1Dispatched = new DispatchCommand(20, DispatchType.Grow, 7, true, [1, 12])
    const command2Dispatched = new DispatchCommand(19, DispatchType.Weaken, 4, false, [42])
    const command3Dispatched = new DispatchCommand(180, DispatchType.Hack, 5, true)
    const command4Dispatched = new DispatchCommand(18, DispatchType.Hack, 5, true, [62, 5023, 5610])
    const command5Grow = new DispatchCommand(1400, DispatchType.Grow, randomValues.randomInt(), randomValues.randomBool())
    const command6Hack = new DispatchCommand(142, DispatchType.Hack, randomValues.randomInt(), randomValues.randomBool())
    const command7Weaken = new DispatchCommand(365, DispatchType.Weaken, randomValues.randomInt(), randomValues.randomBool())

    const command5Pid1 = randomValues.randomInt()
    const command5Pid2 = randomValues.randomInt()

    const command6Pid1 = randomValues.randomInt()
    const command6Pid2 = randomValues.randomInt()

    const command7Pid1 = randomValues.randomInt()
    const command7Pid2 = randomValues.randomInt()


    const targetName = randomValues.randomString()

    const environment = [
        {
            hostname: "asdfkl",
            possibleWeakenOrGrowThreads: 7300,
            possibleHackThreads: 7500,
            hasAdminRights: false,
        },
        {
            hostname: "server4",
            possibleWeakenOrGrowThreads: 10,
            possibleHackThreads: 12,
            hasAdminRights: true,
        },
        {
            hostname: "bigserver",
            possibleWeakenOrGrowThreads: 730, // 1. gone || 1400 - 757 = 643
            possibleHackThreads: 750,
            hasAdminRights: true,
            cpuCores: 2, 
        },
        {
            hostname: "asdfasdkl",
            possibleWeakenOrGrowThreads: 73000,
            possibleHackThreads: 75000,
            hasAdminRights: false,
        },
        {
            hostname: "server3",
            possibleWeakenOrGrowThreads: 360, // 3. used these 300 - gone
            possibleHackThreads: 370,
            hasAdminRights: true,
            cpuCores: 1,
        },
        {
            hostname: "bigserver2",
            possibleWeakenOrGrowThreads: 730, // 2. 598 used leaving 132 // step 4. 3 used leaving 129
            possibleHackThreads: 750,         //                     135                           131  
            hasAdminRights: true,
            cpuCores: 3,
        },
        {
            hostname: targetName,
            possibleWeakenOrGrowThreads: 0,
            possibleHackThreads: 0,
            hasAdminRights: true,
            threadsToReduceToMinDifficulty: [
                new ThreadsNeeded(1, 365),
                new ThreadsNeeded(2, 360),
                new ThreadsNeeded(3, 200),

            ],

            threadsToIncreaseToMaxMoney: [
                new ThreadsNeeded(1, 1400),
                new ThreadsNeeded(2, 1350),
                new ThreadsNeeded(3, 1300),
            ]
        },
    ]

    it('should not do anything if there are no uncompleted dispatch requests', async () => {
        const batches = [
            new DispatchBatch(
                DispatchOrigin.First,
                "af",
                [
                    command1Dispatched
                ],
                true
            )
        ]

        const mockedNs = await setUp(batches)

        expect(mockedNs.execArgsPassed.length).toBe(0)
    })


    it('should dispatch the commands needed.', async () => {
        const batches =
            [
                new DispatchBatch(
                    DispatchOrigin.Batch,
                    "target1",
                    [
                        command1Dispatched,
                        command2Dispatched,
                        command3Dispatched,
                        command4Dispatched
                    ],
                    true
                ),
                new DispatchBatch(
                    DispatchOrigin.First,
                    targetName,
                    [
                        command6Hack,
                        command5Grow,
                        command7Weaken,
                    ]
                )
            ]

        const mockedNs = await setUp(batches)


        // do weaken and grow first because we can take advantage of multiple cores 
        // grow 
        const execArgs0 = mockedNs.execArgsPassed[0]

        expect(execArgs0[0]).toBe(command5Grow.commandType)
        expect(execArgs0[1]).toBe("bigserver")
        expect(execArgs0[2]).toBe(730)
        expect(execArgs0[3][0]).toBe(targetName)
        expect(execArgs0[3][1]).toBe(command5Grow.msAdded)
        expect(execArgs0[3][2]).toBe(command5Grow.effectStockMarket)

        const execArgs1 = mockedNs.execArgsPassed[1]
        expect(execArgs1[0]).toBe(command5Grow.commandType)
        expect(execArgs1[1]).toBe("bigserver2")
        expect(execArgs1[2]).toBe(598)
        expect(execArgs1[3][0]).toBe(targetName)
        expect(execArgs1[3][1]).toBe(command5Grow.msAdded)
        expect(execArgs1[3][2]).toBe(command5Grow.effectStockMarket)



        // weaken // command7
        const execArgs2 = mockedNs.execArgsPassed[2]
        expect(execArgs2[0]).toBe(command7Weaken.commandType)
        expect(execArgs2[1]).toBe("server3")
        expect(execArgs2[2]).toBe(360)
        expect(execArgs2[3][0]).toBe(targetName)
        expect(execArgs2[3][1]).toBe(command7Weaken.msAdded)
        expect(execArgs2[3][2]).toBe(command7Weaken.effectStockMarket)

        const execArgs3 = mockedNs.execArgsPassed[3]
        // bigServer2 5
        expect(execArgs3[0]).toBe(command7Weaken.commandType)
        expect(execArgs3[1]).toBe("bigserver2")
        expect(execArgs3[2]).toBe(3)
        expect(execArgs3[3][0]).toBe(targetName)
        expect(execArgs3[3][1]).toBe(command7Weaken.msAdded)
        expect(execArgs3[3][2]).toBe(command7Weaken.effectStockMarket)


        // hack command 6
        const execArgs4 = mockedNs.execArgsPassed[4]
        // bigServer2 56
        expect(execArgs4[0]).toBe(command6Hack.commandType)
        expect(execArgs4[1]).toBe("bigserver2")
        expect(execArgs4[2]).toBe(131)
        expect(execArgs4[3][0]).toBe(targetName)
        expect(execArgs4[3][1]).toBe(command6Hack.msAdded)
        expect(execArgs4[3][2]).toBe(command6Hack.effectStockMarket)


        const execArgs5 = mockedNs.execArgsPassed[5]
        // server4 10
        expect(execArgs5[0]).toBe(command6Hack.commandType)
        expect(execArgs5[1]).toBe("server4")
        expect(execArgs5[2]).toBe(11)
        expect(execArgs5[3][0]).toBe(targetName)
        expect(execArgs5[3][1]).toBe(command6Hack.msAdded)
        expect(execArgs5[3][2]).toBe(command6Hack.effectStockMarket)


        expect(mockedNs.execArgsPassed.length).toBe(6)

        const expectedCommand6 = JSON.parse(JSON.stringify(command6Hack)) as DispatchCommand
        const expectedCommand5 = JSON.parse(JSON.stringify(command5Grow)) as DispatchCommand
        const expectedCommand7 = JSON.parse(JSON.stringify(command7Weaken)) as DispatchCommand

        expectedCommand5.pids = [
            command5Pid1,
            command5Pid2
        ]

        expectedCommand5.threadsExecuting = 1401

        expectedCommand6.pids = [
            command6Pid1,
            command6Pid2
        ]

        expectedCommand6.threadsExecuting = command6Hack.threadsWanted

        expectedCommand7.pids = [
            command7Pid1,
            command7Pid2
        ]

        expectedCommand7.threadsExecuting = command7Weaken.threadsWanted

        expect(mockedNs.writeTuples[0][0]).toBe(FilePaths.data.dispatchQueue)
        expect(mockedNs.writeTuples[0][1]).toBe(JSON.stringify(new DispatchQueue([
            new DispatchBatch(
                DispatchOrigin.Batch,
                "target1",
                [
                    command1Dispatched,
                    command2Dispatched,
                    command3Dispatched,
                    command4Dispatched
                ],
                true
            ),
            new DispatchBatch(
                DispatchOrigin.First,
                targetName,
                [
                    expectedCommand5,
                    expectedCommand7,
                    expectedCommand6,
                ],
                true
            )
        ])))

        expect(mockedNs.writeTuples[0][2]).toBe("w")
    })

    async function setUp(batches: DispatchBatch[]) {
        const nsSetup = new nsMock()
        const ns = nsSetup as unknown

        const dispatchQueue = new DispatchQueue(batches)

        nsSetup.readReturns.set(FilePaths.data.dispatchQueue, [JSON.stringify(dispatchQueue)])
        nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify(environment)])

        nsSetup.execResponses.set(command5Grow.commandType, [command5Pid1, command5Pid2])
        nsSetup.execResponses.set(command6Hack.commandType, [command6Pid1, command6Pid2])
        nsSetup.execResponses.set(command7Weaken.commandType, [command7Pid1, command7Pid2])

        await main(ns as NS)

        return ns as nsMock
    }
})