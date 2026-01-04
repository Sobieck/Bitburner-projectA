import { main } from "../../src/scripts/hacking/gainAccess"
import { NS } from "@ns"
import { nsMock } from "../mocks/ns.mock"


describe('', () => {
    let mockedNs = new nsMock()

    beforeEach(async () => {
        const nsSetup = new nsMock()
        const ns = nsSetup as unknown

        // await main(ns as NS);

        mockedNs = ns as nsMock;
    })

    it('should', async () => {

    })

})