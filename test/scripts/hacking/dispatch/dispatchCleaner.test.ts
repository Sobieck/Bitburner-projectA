import { main } from "../../../../src/scripts/hacking/dispatch/dispatchCleaner"
import { NS } from "@ns"
import { nsMock } from "../../../utilities/nsMock.testUtility"
import { FilePaths } from "../../../../src/scripts/constants"
import { DispatchBatch, DispatchCommand, DispatchOrigin, DispatchQueue, DispatchType } from "../../../../src/scripts/models/hacking/dispatch/dispatchQueue"
import { RandomValues } from "../../../utilities/randomValues.testUtility"

describe('dispatchCleaner', () => {

    it("should create the dispatchQueue if it doesn't exist", async () => {

        const nsSetup = new nsMock()

        nsSetup.fileExistsReturns.set(FilePaths.data.dispatchQueue, false)

        const ns = nsSetup as unknown

        await main(ns as NS);

        const mockedNs = ns as nsMock;

        expect(mockedNs.callOrder.length).toBe(2)
        expect(mockedNs.writeTuples[0][0]).toBe(FilePaths.data.dispatchQueue)
        expect(mockedNs.writeTuples[0][1]).toBe(JSON.stringify(new DispatchQueue([])))
        expect(mockedNs.writeTuples[0][2]).toBe("w")

    })

    it("should delete DispatchCommand pids that are no longer alive", async () => {

        const nsSetup = new nsMock()

        nsSetup.fileExistsReturns.set(FilePaths.data.dispatchQueue, true)

        const pid0 = RandomValues.int(10000)
        const pid1 = pid0 + 1
        const pid2ToDelete = pid0 + 2
        const pid3ToDelete = pid0 + 3
        const pid4 = pid0 + 4
        const pid5ToDelete = pid0 + 5
        const pid6 = pid0 + 6
        const pid7ToDelete = pid0 + 7
        const pid8ToDelete = pid0 + 8
        const pid9 = pid0 + 9


        const dispatchBatch1 = new DispatchBatch(
            DispatchOrigin.Batch,
            "target1",
            [
                new DispatchCommand(
                    12,
                    DispatchType.Grow,
                    0,
                    false,
                    [
                        pid0,
                        pid1,
                        pid2ToDelete,
                        pid3ToDelete,
                    ]
                ),
                new DispatchCommand(
                    15,
                    DispatchType.Weaken,
                    0,
                    false,
                    [
                        pid4,
                    ]
                )
            ]
        )

        const dispatchBatch2 = new DispatchBatch(
            DispatchOrigin.PrepareForBatch,
            "target2",
            [
                new DispatchCommand(
                    12,
                    DispatchType.Grow,
                    0,
                    false,
                    [
                        pid5ToDelete,
                        pid6,
                        pid7ToDelete,
                    ]
                ),
                new DispatchCommand(
                    15,
                    DispatchType.Hack,
                    0,
                    false,
                    [
                        pid8ToDelete,
                        pid9,
                    ]
                )
            ]
        )

        const batches = [
            dispatchBatch1,
            dispatchBatch2
        ]

        nsSetup.readReturns.set(FilePaths.data.dispatchQueue, [JSON.stringify(new DispatchQueue(batches))])


        nsSetup.isRunningResponses.set(pid0, true)
        nsSetup.isRunningResponses.set(pid1, true)
        nsSetup.isRunningResponses.set(pid2ToDelete, false)
        nsSetup.isRunningResponses.set(pid3ToDelete, false)
        nsSetup.isRunningResponses.set(pid4, true)

        nsSetup.isRunningResponses.set(pid5ToDelete, false)
        nsSetup.isRunningResponses.set(pid6, true)
        nsSetup.isRunningResponses.set(pid7ToDelete, false)
        nsSetup.isRunningResponses.set(pid8ToDelete, false)
        nsSetup.isRunningResponses.set(pid9, true)

        const ns = nsSetup as unknown

        await main(ns as NS);

        const mockedNs = ns as nsMock;

        expect(mockedNs.writeTuples[0][0]).toBe(FilePaths.data.dispatchQueue)
        expect(mockedNs.writeTuples[0][1]).toBe(JSON.stringify(new DispatchQueue([
            new DispatchBatch(
                DispatchOrigin.Batch,
                "target1",
                [
                    new DispatchCommand(
                        12,
                        DispatchType.Grow,
                        0,
                        false,
                        [
                            pid0,
                            pid1
                        ]
                    ),
                    new DispatchCommand(
                        15,
                        DispatchType.Weaken,
                        0,
                        false,
                        [
                            pid4,
                        ]
                    )
                ]
            ),
            new DispatchBatch(
                DispatchOrigin.PrepareForBatch,
                "target2",
                [
                    new DispatchCommand(
                        12,
                        DispatchType.Grow,
                        0,
                        false,
                        [
                            pid6,
                        ]
                    ),
                    new DispatchCommand(
                        15,
                        DispatchType.Hack,
                        0,
                        false,
                        [
                            pid9,
                        ]
                    )
                ]
            )

        ])))
        expect(mockedNs.writeTuples[0][2]).toBe("w")

    })

    it("should delete DispatchBatches who jobs if there are no dispatches left and they have been dispatched", async () => {

        const nsSetup = new nsMock()

        nsSetup.fileExistsReturns.set(FilePaths.data.dispatchQueue, true)

        const pid0ToDelete = RandomValues.int(10000)
        const pid1ToDelete = pid0ToDelete + 1
        const pid2ToDelete = pid0ToDelete + 2
        const pid3ToDelete = pid0ToDelete + 3
        const pid4ToDelete = pid0ToDelete + 4
        const pid5ToDelete = pid0ToDelete + 5
        const pid6 = pid0ToDelete + 6
        const pid7ToDelete = pid0ToDelete + 7
        const pid8ToDelete = pid0ToDelete + 8
        const pid9ToDelete = pid0ToDelete + 9


        const dispatchBatch1 = new DispatchBatch(
            DispatchOrigin.Batch,
            "target1",
            [
                new DispatchCommand(
                    12,
                    DispatchType.Grow,
                    0,
                    false,
                    [
                        pid0ToDelete,
                        pid1ToDelete,
                        pid2ToDelete,
                        pid3ToDelete,
                    ]
                ),
                new DispatchCommand(
                    15,
                    DispatchType.Weaken,
                    0,
                    false,
                    [
                        pid4ToDelete,
                    ]
                )
            ]
        )

        const dispatchBatch2 = new DispatchBatch(
            DispatchOrigin.PrepareForBatch,
            "target2",
            [
                new DispatchCommand(
                    12,
                    DispatchType.Grow,
                    0,
                    false,
                    [
                        pid5ToDelete,
                        pid6,
                        pid7ToDelete,
                    ]
                ),
                new DispatchCommand(
                    15,
                    DispatchType.Hack,
                    0,
                    false,
                    [
                        pid8ToDelete,
                        pid9ToDelete,
                    ]
                )
            ]
        )

        const batches = [
            dispatchBatch1,
            dispatchBatch2
        ]

        nsSetup.readReturns.set(FilePaths.data.dispatchQueue, [JSON.stringify(new DispatchQueue(batches))])


        nsSetup.isRunningResponses.set(pid0ToDelete, false)
        nsSetup.isRunningResponses.set(pid1ToDelete, false)
        nsSetup.isRunningResponses.set(pid2ToDelete, false)
        nsSetup.isRunningResponses.set(pid3ToDelete, false)
        nsSetup.isRunningResponses.set(pid4ToDelete, false)

        nsSetup.isRunningResponses.set(pid5ToDelete, false)
        nsSetup.isRunningResponses.set(pid6, true)
        nsSetup.isRunningResponses.set(pid7ToDelete, false)
        nsSetup.isRunningResponses.set(pid8ToDelete, false)
        nsSetup.isRunningResponses.set(pid9ToDelete, false)


        const ns = nsSetup as unknown

        await main(ns as NS);

        const mockedNs = ns as nsMock;

        expect(mockedNs.writeTuples[0][0]).toBe(FilePaths.data.dispatchQueue)
        expect(mockedNs.writeTuples[0][1]).toBe(JSON.stringify(new DispatchQueue([
            new DispatchBatch(
                DispatchOrigin.PrepareForBatch,
                "target2",
                [
                    new DispatchCommand(
                        12,
                        DispatchType.Grow,
                        0,
                        false,
                        [
                            pid6,
                        ]
                    )
                ]
            )

        ])))
        expect(mockedNs.writeTuples[0][2]).toBe("w")
    })
})