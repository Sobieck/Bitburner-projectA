import { NSMock } from "../src/ns-mock/interface/MockedNetscriptDefinitions";
import { main } from "../src/orchestration"
import { NS } from "@ns";

export class nsMock {

  public sleepAmount: number | undefined;

  public async sleep(millis?: number): Promise<true> {
    this.sleepAmount = millis;

    return await true;
  }
}

describe('Orchestration', () => {
  it('Grow `testServer`', async () => {
    const ns: unknown = new nsMock()

    const toGrow = await main(ns as NS);

    const mockedNs = ns as nsMock;

    expect(mockedNs.sleepAmount).toBe(1000)
  });
});