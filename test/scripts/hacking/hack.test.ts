import { main } from "../../../src/scripts/hacking/hack"
import { NS } from "@ns"
import { nsMock } from "../../utilities/nsMock.testUtility"


describe('hack', () => {
    it('should nuke the one with enough ports open and skill level is right and we do not have admin rights.', async () => {
        const nsSetup = new nsMock()



        const ns = nsSetup as unknown
        await main(ns as NS);

        const mockedNs = ns as nsMock;

    })
})