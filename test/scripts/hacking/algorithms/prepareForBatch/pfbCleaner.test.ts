import { NS } from "@ns"
import { FilePaths } from "../../../../../src/scripts/constants"
import { main } from "../../../../../src/scripts/hacking/algorithms/prepareForBatch/pfbCleaner"
import { PrepareForBatchQueue, PrepareForBatchTarget } from "../../../../../src/scripts/models/hacking/algorithms/prepareForBatchTargets"
import { DispatchBatch, DispatchOrigin, DispatchQueue } from "../../../../../src/scripts/models/hacking/dispatch/dispatchQueue"
import { nsMock } from "../../../../utilities/nsMock.testUtility"
import { RandomValues } from "../../../../utilities/randomValues.testUtility"


describe('prepare for batch cleaner', () => {
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


    describe('there is no saved preparForBatchData', () => {
        it('should create that object, save it, and exit', async () => {
            const nsSetup = new nsMock()

            nsSetup.readReturns.set(FilePaths.data.dispatchQueue, [JSON.stringify(
                new DispatchQueue([
                    new DispatchBatch(DispatchOrigin.Batch, "Something", [], true),
                    new DispatchBatch(DispatchOrigin.Junk, "Somf", [], true)
                ])
            )])

            nsSetup.fileExistsReturns.set(FilePaths.data.prepareForBatchQueue, false)

            const ns = nsSetup as unknown

            await main(ns as NS);

            mockedNs = ns as nsMock;

            expect(mockedNs.callOrder.length).toBe(3)

            expect(mockedNs.writeTuples[0][0]).toBe(FilePaths.data.prepareForBatchQueue)
            expect(mockedNs.writeTuples[0][2]).toBe("w")
            expect(mockedNs.writeTuples[0][1]).toBe(JSON.stringify(
                new PrepareForBatchQueue()
            ))

        })
    })

    describe('there are no undispatched jobs', () => {
        it('should clean the prepareForBatchQueue', async () => {
            const nsSetup = new nsMock()

            const targetStillInProcess = RandomValues.string()
            const targetStillInProcessDate = Date.now()

            const targetNotInProcess = RandomValues.string()
            const targetNotInProcessDate = targetStillInProcessDate + 123


            nsSetup.readReturns.set(FilePaths.data.dispatchQueue, [JSON.stringify(
                new DispatchQueue([
                    new DispatchBatch(DispatchOrigin.Batch, targetNotInProcess, [], true),
                    new DispatchBatch(DispatchOrigin.Junk, "something", [], true),
                    new DispatchBatch(DispatchOrigin.PrepareForBatch, targetStillInProcess, [], true)
                ])
            )])

            nsSetup.fileExistsReturns.set(FilePaths.data.prepareForBatchQueue, true)


            nsSetup.readReturns.set(FilePaths.data.prepareForBatchQueue, [JSON.stringify(
                new PrepareForBatchQueue([
                    new PrepareForBatchTarget(targetStillInProcess, 12, targetStillInProcessDate, false, true, false),
                    new PrepareForBatchTarget(targetNotInProcess, 13, targetNotInProcessDate, false, true, false),
                ])
            )])

            const ns = nsSetup as unknown


            await main(ns as NS);

            mockedNs = ns as nsMock;

            expect(mockedNs.writeTuples[0][0]).toBe(FilePaths.data.prepareForBatchQueue)
            expect(mockedNs.writeTuples[0][2]).toBe("w")
            expect(mockedNs.writeTuples[0][1]).toBe(JSON.stringify(
                new PrepareForBatchQueue([
                    new PrepareForBatchTarget(targetStillInProcess, 12, targetStillInProcessDate, false, true, false),
                    new PrepareForBatchTarget(targetNotInProcess, 13, targetNotInProcessDate, false, false, false),
                ])
            ))


            // expect(mockedNs.callOrder.length).toBe(1)
        })
    })



})


// see if any servers are 100% free
// run weaken, grow, hack on the server with the most possible money that is hacked