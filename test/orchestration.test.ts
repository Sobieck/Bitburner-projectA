import { main } from "../src/orchestration"
import { NS } from "@ns";
import { nsMock } from "./mocks/ns.mock";


describe('Orchestration', () => {

  describe('there are no scripts', () => {
  
    it("should print that the file doesn't exist.", async () => {
      const ns: unknown = new nsMock()

      await main(ns as NS);

      const mockedNs = ns as nsMock;
    })
  })


  // it('sleep for 700 ms', async () => {
  //   const ns: unknown = new nsMock()

  //   await main(ns as NS);

  //   const mockedNs = ns as nsMock;

  //   expect(mockedNs.sleepAmount[0]).toBe(700)
  //   expect(mockedNs.callOrder[0]).toBe("sleep")
  // });
});