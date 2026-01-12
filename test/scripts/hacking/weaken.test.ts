import { main } from "../../../src/scripts/hacking/weaken"
import { NS } from "@ns"
import { nsMock } from "../../utilities/nsMock.testUtility"
import { RandomValues } from "../../utilities/randomValues.testUtility"


describe('weaken', () => {
    it('run the weaken command with the correct args passed in.', async () => {
        const nsSetup = new nsMock()

        const target = RandomValues.string()
        nsSetup.args.push(target)

        const additionalMsec = RandomValues.int(100)
        nsSetup.args.push(additionalMsec)

        let stock = false

        if (additionalMsec % 2 === 0) {
            stock = true
        }

        nsSetup.args.push(stock)

        const ns = nsSetup as unknown
        await main(ns as NS);

        const mockedNs = ns as nsMock;


        expect(mockedNs.weakenArgsPassed.length).toBe(1)
        expect(mockedNs.weakenArgsPassed[0][0]).toBe(target)
        expect(mockedNs.weakenArgsPassed[0][1].additionalMsec).toBe(additionalMsec)
        expect(mockedNs.weakenArgsPassed[0][1].stock).toBe(stock)
    })
})