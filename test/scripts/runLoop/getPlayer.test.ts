import { main } from "../../../src/scripts/runLoop/getPlayer"
import { NS } from "@ns"
import { nsMock } from "../../mocks/ns.mock"


describe('', () => {
    let mockedNs = new nsMock()

    const getPlayerReturn = {
        something: "this",
        fake: "data",
        more: 19,
        evenMore: 1000
    }

    beforeEach(async () => {
        const nsSetup = new nsMock()
        const ns = nsSetup as unknown

        nsSetup.getPlayerReturns = getPlayerReturn

        await main(ns as NS);

        mockedNs = ns as nsMock;
    })

    it('should write self to the runloop data', async () => {
        expect(mockedNs.writeTuples[0][0]).toBe("/data/runLoop/player.json")
        expect(mockedNs.writeTuples[0][2]).toBe("w")
        expect(mockedNs.writeTuples[0][1]).toBe(JSON.stringify(getPlayerReturn))
    })

})