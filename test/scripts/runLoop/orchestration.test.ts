import { main } from "../../../src/scripts/runLoop/orchestration"
import { NS } from "@ns";
import { nsMock } from "../../utilities/nsMock.testUtility";
import { RandomValues } from "../../utilities/randomValues.testUtility";
import { FilePaths } from "../../../src/scripts/constants";


describe('Orchestration', () => {
  let mockedNs = new nsMock()
  let numberOfScriptsToRun = 0

  beforeEach(async () => {
    const nsSetup = new nsMock()
    
    numberOfScriptsToRun = RandomValues.int(20)

    const runScripts = []

    for (let i = 0; i < numberOfScriptsToRun; i++) {
      runScripts.push(i.toString())      
    }

    nsSetup.readReturns.set(FilePaths.data.scriptsToRun, [JSON.stringify(runScripts)])
    
    const ns = nsSetup as unknown


    await main(ns as NS);
   
    mockedNs = ns as nsMock;
  })

  it("should run scriptsToRun first thing.", async () => {
    expect(mockedNs.callOrder[0]).toBe("run")
    expect(mockedNs.runTuples[0][0]).toBe(FilePaths.scripts.scriptsToRun)
    expect(mockedNs.runTuples[0][1]).toBeUndefined()
    expect(mockedNs.runTuples[0][2]).toBeUndefined()
  })

  it("should then sleep for a second as the 2nd action", async () => {
    expect(mockedNs.callOrder[1]).toBe("sleep")
    expect(mockedNs.sleepAmounts[0]).toBe(1000)
  })

  it("should run orchestrate last thing.", async () => {
    const totalCalls = mockedNs.callOrder.length
    const totalRuns = mockedNs.runTuples.length

    expect(mockedNs.callOrder[totalCalls - 1]).toBe("run")
    expect(mockedNs.runTuples[totalRuns - 1][0]).toBe(FilePaths.scripts.orchestration)
    expect(mockedNs.runTuples[0][1]).toBeUndefined()
    expect(mockedNs.runTuples[0][2]).toBeUndefined()
  })

  it("should run sleep second to last thing.", async () => {
    const totalCalls = mockedNs.callOrder.length
    const numberOfSleeps = mockedNs.sleepAmounts.length

    expect(mockedNs.callOrder[totalCalls - 2]).toBe("sleep")
    expect(mockedNs.sleepAmounts[numberOfSleeps - 1]).toBe(1000)
  })

  it("should sleep and run the scripts", async () => {

    expect(mockedNs.callOrder[3]).toBe("sleep")
    expect(mockedNs.callOrder[4]).toBe("run")

    for (let i = 0; i < numberOfScriptsToRun - 1; i++) {
      expect(mockedNs.sleepAmounts[i + 1]).toBe(250)
    }
    
    expect(mockedNs.runTuples.length).toBe(numberOfScriptsToRun + 2)
    for (let i = 0; i < numberOfScriptsToRun; i++) {
      expect(mockedNs.runTuples[i + 1][0]).toBe(i.toString())
      expect(mockedNs.runTuples[i + 1][1]).toBeUndefined()
      expect(mockedNs.runTuples[i + 1][2]).toBeUndefined()
    }

  })

});