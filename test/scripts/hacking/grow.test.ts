import { main } from "../../../src/scripts/hacking/grow"
import { NS } from "@ns"
import { nsMock } from "../../utilities/nsMock.testUtility"
import { RandomValues } from "../../utilities/randomValues.testUtility"


describe('grow', () => {
    it('run the grow command with the correct args passed in.', async () => {
        const nsSetup = new nsMock()

        const randomGenerator = new RandomValues()

        const target = randomGenerator.randomString()
        nsSetup.args.push(target)

        const additionalMsec = randomGenerator.randomInt(100)
        nsSetup.args.push(additionalMsec)

        let stock = false

        if (additionalMsec % 2 === 0) {
            stock = true
        }

        nsSetup.args.push(stock)

        const ns = nsSetup as unknown
        await main(ns as NS);

        const mockedNs = ns as nsMock;


        expect(mockedNs.growArgsPassed.length).toBe(1)
        expect(mockedNs.growArgsPassed[0][0]).toBe(target)
        expect(mockedNs.growArgsPassed[0][1].additionalMsec).toBe(additionalMsec)
        expect(mockedNs.growArgsPassed[0][1].stock).toBe(stock)
    })
})