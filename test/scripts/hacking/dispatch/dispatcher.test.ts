import { main } from "../../../../src/scripts/hacking/dispatch/dispatcher"
import { NS } from "@ns"
import { nsMock } from "../../../utilities/nsMock.testUtility"
import { DispatchCommand, DispatchOrigin, DispatchQueue, DispatchType } from "../../../../src/scripts/models/hacking/dispatch/dispatchQueue"
import { RandomValues } from "../../../utilities/randomValues.testUtility"
import { FilePaths } from "../../../../src/scripts/models/filePaths"

describe('dispatcher', () => {
    let mockedNs = new nsMock()

//     const randomValues = new RandomValues()

//     const command1Dispatched = new DispatchCommand(DispatchOrigin.First, "1", 20, DispatchType.Grow, 7, true, 1)
//     const command2 = new DispatchCommand(DispatchOrigin.First, randomValues.randomString(), randomValues.randomInt(), DispatchType.Grow, randomValues.randomInt(), randomValues.randomBool())
//     const command3Dispatched = new DispatchCommand(DispatchOrigin.First, "3", 19, DispatchType.Weaken, 4, false, 42)
//     const command4Dispatched = new DispatchCommand(DispatchOrigin.Batch, "4", 18, DispatchType.Hack, 5, true, 78)
//     const command5 = new DispatchCommand(DispatchOrigin.Batch, randomValues.randomString(), randomValues.randomInt(), DispatchType.Hack, randomValues.randomInt(), randomValues.randomBool())
//     const command6Dispatched = new DispatchCommand(DispatchOrigin.First, "6", 18, DispatchType.Hack, 5, true, 62)
//     const command7 = new DispatchCommand(DispatchOrigin.Batch, randomValues.randomString(), randomValues.randomInt(), DispatchType.Weaken, randomValues.randomInt(), randomValues.randomBool())

//     const command2Pid = randomValues.randomInt()
//     const command5Pid = randomValues.randomInt()
//     const command7Pid = randomValues.randomInt()

// // weaken with random msAdded, random stock market, hit 2 of each type have plenty of pids going already 

//     beforeEach(async () => {
//         const nsSetup = new nsMock()
//         const ns = nsSetup as unknown

//         const dispatchQueue = new DispatchQueue([
//             command1Dispatched,
//             command2,
//             command3Dispatched,
//             command4Dispatched,
//             command5,
//             command6Dispatched,
//             command7
//         ])

//         nsSetup.readReturns.set(FilePaths.data.dispatchQueue, JSON.stringify(dispatchQueue))


//         nsSetup.execResponses.set(command2.target, [ command2Pid ])
//         nsSetup.execResponses.set(command5.target, [ command5Pid ])
//         nsSetup.execResponses.set(command7.target, [ command7Pid ])

//         await main(ns as NS);

//         mockedNs = ns as nsMock;
//     })

//     it('should dispatch the commands needed and set the pids on the queue.', async () => {

//         expect(mockedNs.execArgsPassed.length).toBe(3)

//         const command2ExecArgs = mockedNs.execArgsPassed[0]



//         const command5ExecArgs = mockedNs.execArgsPassed[1]



//         const command7ExecArgs = mockedNs.execArgsPassed[2]
//     })

    it('should modify the dispatch queue correctly', async () => {

    })

})