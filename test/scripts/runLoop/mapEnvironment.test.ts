import { main } from "../../../src/scripts/runLoop/mapEnvironment"
import { NS } from "@ns";
import { nsMock } from "../../mocks/ns.mock";
import { hostname } from "os";


describe('MapEnvironment', () => {
    let mockedNs = new nsMock()

    const home = {
        hostname: "home",
        requiredHackingSkill: 1,
    }

    const server1 = {
        hostname: "server1", // connects to server 3
        requiredHackingSkill: 100,
    }

    const server2 = {
        hostname: "server2",  // connects to 1 3 4
        requiredHackingSkill: 10,
    }

    const server3 = { // connects to server 1 and 2
        hostname: "server3",
        requiredHackingSkill: 2,
    }

    const server4 = { // connects to 2 
        hostname: "server4",
        requiredHackingSkill: 900,
    }

    const server5 = { // connects to 2 
        hostname: "server5",
        requiredHackingSkill: 901,
    }


    beforeEach(async () => {
        const nsSetup = new nsMock()

        nsSetup.scanReturns.set("home", [server1.hostname, server2.hostname])
        nsSetup.scanReturns.set(server1.hostname, ["home", server3.hostname])
        nsSetup.scanReturns.set(server2.hostname, ["home", server1.hostname, server3.hostname, server4.hostname])
        nsSetup.scanReturns.set(server3.hostname, [server1.hostname, server2.hostname])
        nsSetup.scanReturns.set(server4.hostname, [server2.hostname, server5.hostname])
        nsSetup.scanReturns.set(server5.hostname, [server4.hostname])

        nsSetup.getServerReturns.set("home", home)
        nsSetup.getServerReturns.set(server1.hostname, server1)
        nsSetup.getServerReturns.set(server2.hostname, server2)
        nsSetup.getServerReturns.set(server3.hostname, server3)
        nsSetup.getServerReturns.set(server4.hostname, server4)
        nsSetup.getServerReturns.set(server5.hostname, server5)


        const ns = nsSetup as unknown


        await main(ns as NS);

        mockedNs = ns as nsMock;
    })


    it("should write a well formatted document.", async () => {
        const result = [
            {
                hostname: home.hostname,
                requiredHackingSkill: 1,
                path: []
            },
            {
                hostname: server3.hostname,
                requiredHackingSkill: 2,
                path: [server1.hostname, server3.hostname]
            },
            {
                hostname: server2.hostname,
                requiredHackingSkill: 10,
                path: [server2.hostname],
            },
            {
                hostname: server1.hostname,
                requiredHackingSkill: 100,
                path: [server1.hostname],
            },
            {
                hostname: server4.hostname,
                requiredHackingSkill: 900,
                path: [server2.hostname, server4.hostname],
            },
            {
                hostname: server5.hostname,
                requiredHackingSkill: 901,
                path: [server2.hostname, server4.hostname, server5.hostname]
            },

        ]

        expect(mockedNs.writeTuples[0][0]).toBe("/data/runLoop/environment.txt")
        expect(mockedNs.writeTuples[0][2]).toBe("w")
        expect(mockedNs.writeTuples[0][1]).toBe(JSON.stringify(result))
    })
})