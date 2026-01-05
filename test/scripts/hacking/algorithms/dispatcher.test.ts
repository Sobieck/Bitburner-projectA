import { main } from "../../../../src/scripts/hacking/algorithms/firstAlgorithm"
import { NS } from "@ns"
import { nsMock } from "../../../utilities/nsMock.testUtility"


describe('dispatcher', () => {
    let mockedNs = new nsMock()

    beforeEach(async () => {
        const nsSetup = new nsMock()
        const ns = nsSetup as unknown

        await main(ns as NS);

        mockedNs = ns as nsMock;
    })

    it('should', async () => {

    })

    // dispatches - checks to make sure jobs are alive - deletes them if they are done

})