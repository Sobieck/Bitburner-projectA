import { main } from "../../src/infrastructure/scriptToRun"
import { NS } from "@ns";
import { nsMock } from "../mocks/ns.mock";


describe('ScriptsToRun', () => {
 
    it("should write the contents of a string array to /data/scripts-to-run.txt", async () => {
      const ns: unknown = new nsMock()
      await main(ns as NS);
      const mockedNs = ns as nsMock;


      expect(mockedNs.callOrder.length).toBe(1)

      const writtenData = mockedNs.writeTuples[0]

      expect(writtenData[0]).toBe("/data/scripts-to-run.txt")
      expect(writtenData[2]).toBe("w")

      expect(writtenData[1][0]).toBe("[")
      expect(writtenData[1][writtenData[1].length - 1]).toBe("]")
    })
});