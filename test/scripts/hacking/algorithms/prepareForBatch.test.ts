import { main } from "../../../../src/scripts/hacking/algorithms/prepareForBatch"
import { NS } from "@ns"
import { nsMock } from "../../../utilities/nsMock.testUtility"


describe('first hacking algorithm', () => {
    let mockedNs = new nsMock()

    beforeEach(async () => {
        const nsSetup = new nsMock()
        const ns = nsSetup as unknown

        await main(ns as NS);

        mockedNs = ns as nsMock;
    })

    it('should', async () => {

    })

})


// see if any servers are 100% free
// run weaken, grow, hack on the server with the most possible money that is hacked