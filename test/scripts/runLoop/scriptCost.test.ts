import { main } from "../../../src/scripts/runLoop/scriptCost"
import { NS } from "@ns"
import { nsMock } from "../../utilities/nsMock.testUtility"
import { ScriptRamCost } from "../../../src/scripts/models/runLoop/scriptRamCost"
import { FilePaths } from "../../../src/scripts/constants"


describe('scriptCost', () => {
    let mockedNs = new nsMock()

    beforeEach(async () => {
        const nsSetup = new nsMock()

        nsSetup.lsReturns
            .set("home", new Map<string, string[]>()
                .set('scripts/',
                    [
                        "scripts/models/serverWithAdditionalInfo.js",
                        "scripts/runLoop/mapEnvironment.js",
                        "scripts/runLoop/orchestration.js",
                        "scripts/runLoop/scriptCost.js",
                        "scripts/models/akdo.js",
                        "scripts/pickles/mp.js",
                        "scripts/runLoop/scriptsToRun.js"
                    ]))

        nsSetup.getScriptRamReturns.set("scripts/models/serverWithAdditionalInfo.js", 1000)
        nsSetup.getScriptRamReturns.set("scripts/runLoop/mapEnvironment.js", 0)
        nsSetup.getScriptRamReturns.set("scripts/runLoop/orchestration.js", 156)
        nsSetup.getScriptRamReturns.set("scripts/runLoop/scriptCost.js", 15000)
        nsSetup.getScriptRamReturns.set("scripts/models/akdo.js", 2)
        nsSetup.getScriptRamReturns.set("scripts/pickles/mp.js", 10)
        nsSetup.getScriptRamReturns.set("scripts/runLoop/scriptsToRun.js", .2)

        const ns = nsSetup as unknown

        await main(ns as NS);

        mockedNs = ns as nsMock;
    })

    it("should create an array with all the scripts and their ram costs", async () => {
        const expectedResult: ScriptRamCost[] = [
            new ScriptRamCost("scripts/runLoop/mapEnvironment.js", 0),
            new ScriptRamCost("scripts/runLoop/orchestration.js", 156),
            new ScriptRamCost("scripts/runLoop/scriptCost.js", 15000),
            new ScriptRamCost("scripts/pickles/mp.js", 10),
            new ScriptRamCost("scripts/runLoop/scriptsToRun.js", .2),
        ]

        expect(mockedNs.writeTuples[0][0]).toBe(FilePaths.data.scriptRamCost)
        expect(mockedNs.writeTuples[0][2]).toBe("w")
        expect(mockedNs.writeTuples[0][1]).toBe(JSON.stringify(expectedResult))
    })
})