import { main } from "../../../../../src/scripts/hacking/algorithms/prepareForBatch/pfbCleaner"
import { NS } from "@ns"
import { nsMock } from "../../../../utilities/nsMock.testUtility"
import { FilePaths } from "../../../../../src/scripts/constants"
import { DispatchBatch, DispatchOrigin, DispatchQueue, DispatchType } from "../../../../../src/scripts/models/hacking/dispatch/dispatchQueue"
import { RandomValues } from "../../../../utilities/randomValues.testUtility"


describe('first hacking algorithm', () => {
    let mockedNs = new nsMock()

    describe('there are undispatched jobs', () => {
        it('should', async () => {
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

    describe('there are no undispatched jobs', () => {
        // beforeEach(async () => {
        //     const nsSetup = new nsMock()
        //     const ns = nsSetup as unknown

        //     await main(ns as NS);

        //     mockedNs = ns as nsMock;
        // })
    })



})


// see if any servers are 100% free
// run weaken, grow, hack on the server with the most possible money that is hacked