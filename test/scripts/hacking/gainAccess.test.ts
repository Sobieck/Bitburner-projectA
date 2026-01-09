import { main } from "../../../src/scripts/hacking/gainAccess"
import { NS } from "@ns"
import { nsMock } from "../../utilities/nsMock.testUtility"
import { FilePaths } from "../../../src/scripts/constants"


describe('gainAccess', () => {
    const player = {
        skills: {
            hacking: 9
        }
    }

    const server1ToNotHackNotSkilledEnough = {
        hostname: "server1ToNotHackNotSkilledEnough",
        sshPortOpen: false,
        ftpPortOpen: false,
        smtpPortOpen: false,
        httpPortOpen: false,
        sqlPortOpen: false,
        hasAdminRights: false,
        numOpenPortsRequired: 0,
        openPortCount: 0,
        requiredHackingSkill: 10,
    }

    const shouldNuke = {
        hostname: "shouldNuke",
        sshPortOpen: false,
        ftpPortOpen: false,
        smtpPortOpen: false,
        httpPortOpen: false,
        sqlPortOpen: false,
        hasAdminRights: false,
        numOpenPortsRequired: 4,
        openPortCount: 4,
        requiredHackingSkill: 9,
    }

    const shouldSkipBecauseWeHaveAdminRightsAndHackingScriptsExist = {
        hostname: "shouldSkipBecauseWeHaveAdminRights",
        sshPortOpen: false,
        ftpPortOpen: false,
        smtpPortOpen: false,
        httpPortOpen: false,
        sqlPortOpen: false,
        hasAdminRights: true,
        numOpenPortsRequired: 4,
        openPortCount: 4,
        requiredHackingSkill: 9,
    }

    const shouldUploadScriptsBecauseAdminButDoesntHaveScriptsOnServer = {
        hostname: "shouldUploadScriptsBecauseAdminButDoesntHaveScriptsOnServer",
        sshPortOpen: false,
        ftpPortOpen: false,
        smtpPortOpen: false,
        httpPortOpen: false,
        sqlPortOpen: false,
        hasAdminRights: true,
        numOpenPortsRequired: 4,
        openPortCount: 4,
        requiredHackingSkill: 9,
    }

    let shouldOpenAllThePortsIfHaveOpeners = {
        hostname: "shouldOpenAllThePortsIfHaveOpeners",
        sshPortOpen: false,
        ftpPortOpen: false,
        smtpPortOpen: false,
        httpPortOpen: false,
        sqlPortOpen: false,
        hasAdminRights: true,
        numOpenPortsRequired: 5,
        openPortCount: 0,
        requiredHackingSkill: 9,
    }

    it('should nuke the one with enough ports open and skill level is right and we do not have admin rights.', async () => {
        const nsSetup = new nsMock()

        nsSetup.readReturns.set(FilePaths.data.player, [JSON.stringify(player)])

        nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify([
            server1ToNotHackNotSkilledEnough,
            shouldNuke,
            shouldSkipBecauseWeHaveAdminRightsAndHackingScriptsExist,
            shouldUploadScriptsBecauseAdminButDoesntHaveScriptsOnServer,
            shouldOpenAllThePortsIfHaveOpeners,
        ])])

        const ns = nsSetup as unknown
        await main(ns as NS);

        const mockedNs = ns as nsMock;

        expect(mockedNs.nukeHostnames.length).toBe(1)
        expect(mockedNs.nukeHostnames[0]).toBe(shouldNuke.hostname)
    })

    it('should open ssh because it isnt open and we have the file.', async () => {
        const nsSetup = new nsMock()

        shouldOpenAllThePortsIfHaveOpeners.hasAdminRights = false

        nsSetup.fileExistsReturns.set("BruteSSH.exe", true)

        nsSetup.readReturns.set(FilePaths.data.player, [JSON.stringify(player)])
        nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify([
            server1ToNotHackNotSkilledEnough,
            shouldNuke,
            shouldSkipBecauseWeHaveAdminRightsAndHackingScriptsExist,
            shouldOpenAllThePortsIfHaveOpeners
        ])])


        const ns = nsSetup as unknown
        await main(ns as NS);

        const mockedNs = ns as nsMock;

        expect(mockedNs.brutesshHostnames.length).toBe(1)
        expect(mockedNs.brutesshHostnames[0]).toBe(shouldOpenAllThePortsIfHaveOpeners.hostname)
    })

    it('should not open ssh because it is open', async () => {
        const nsSetup = new nsMock()

        shouldOpenAllThePortsIfHaveOpeners.hasAdminRights = false
        shouldOpenAllThePortsIfHaveOpeners.sshPortOpen = true

        nsSetup.fileExistsReturns.set("BruteSSH.exe", true)

        nsSetup.readReturns.set(FilePaths.data.player, [JSON.stringify(player)])
        nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify([
            server1ToNotHackNotSkilledEnough,
            shouldNuke,
            shouldSkipBecauseWeHaveAdminRightsAndHackingScriptsExist,
            shouldOpenAllThePortsIfHaveOpeners
        ])])


        const ns = nsSetup as unknown
        await main(ns as NS);

        const mockedNs = ns as nsMock;

        expect(mockedNs.brutesshHostnames.length).toBe(0)
    })


    it('should open ftp because it isnt open and we have the file.', async () => {
        const nsSetup = new nsMock()

        shouldOpenAllThePortsIfHaveOpeners.hasAdminRights = false

        nsSetup.fileExistsReturns.set("FTPCrack.exe", true)

        nsSetup.readReturns.set(FilePaths.data.player, [JSON.stringify(player)])
        nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify([
            server1ToNotHackNotSkilledEnough,
            shouldNuke,
            shouldSkipBecauseWeHaveAdminRightsAndHackingScriptsExist,
            shouldOpenAllThePortsIfHaveOpeners
        ])])


        const ns = nsSetup as unknown
        await main(ns as NS);

        const mockedNs = ns as nsMock;

        expect(mockedNs.ftpcrackHostnames.length).toBe(1)
        expect(mockedNs.ftpcrackHostnames[0]).toBe(shouldOpenAllThePortsIfHaveOpeners.hostname)
    })

    it('should not open FTPCrack.exe because it is open.', async () => {
        const nsSetup = new nsMock()

        shouldOpenAllThePortsIfHaveOpeners.hasAdminRights = false
        shouldOpenAllThePortsIfHaveOpeners.ftpPortOpen = true

        nsSetup.fileExistsReturns.set("FTPCrack.exe", true)

        nsSetup.readReturns.set(FilePaths.data.player, [JSON.stringify(player)])
        nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify([
            server1ToNotHackNotSkilledEnough,
            shouldNuke,
            shouldSkipBecauseWeHaveAdminRightsAndHackingScriptsExist,
            shouldOpenAllThePortsIfHaveOpeners
        ])])


        const ns = nsSetup as unknown
        await main(ns as NS);

        const mockedNs = ns as nsMock;

        expect(mockedNs.ftpcrackHostnames.length).toBe(0)
    })

    it('should open RelaySMTP because it isnt open and we have the file.', async () => {
        const nsSetup = new nsMock()

        shouldOpenAllThePortsIfHaveOpeners.hasAdminRights = false

        nsSetup.fileExistsReturns.set("RelaySMTP.exe", true)

        nsSetup.readReturns.set(FilePaths.data.player, [JSON.stringify(player)])
        nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify([
            server1ToNotHackNotSkilledEnough,
            shouldNuke,
            shouldSkipBecauseWeHaveAdminRightsAndHackingScriptsExist,
            shouldOpenAllThePortsIfHaveOpeners
        ])])


        const ns = nsSetup as unknown
        await main(ns as NS);

        const mockedNs = ns as nsMock;

        expect(mockedNs.relaysmtpHostnames.length).toBe(1)
        expect(mockedNs.relaysmtpHostnames[0]).toBe(shouldOpenAllThePortsIfHaveOpeners.hostname)
    })

    it('should not open RelaySMTP.exe because it is open.', async () => {
        const nsSetup = new nsMock()

        shouldOpenAllThePortsIfHaveOpeners.hasAdminRights = false
        shouldOpenAllThePortsIfHaveOpeners.smtpPortOpen = true

        nsSetup.fileExistsReturns.set("RelaySMTP.exe", true)

        nsSetup.readReturns.set(FilePaths.data.player, [JSON.stringify(player)])
        nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify([
            server1ToNotHackNotSkilledEnough,
            shouldNuke,
            shouldSkipBecauseWeHaveAdminRightsAndHackingScriptsExist,
            shouldOpenAllThePortsIfHaveOpeners
        ])])

        const ns = nsSetup as unknown
        await main(ns as NS);

        const mockedNs = ns as nsMock;

        expect(mockedNs.relaysmtpHostnames.length).toBe(0)
    })

    it('should open HTTPWorm because it isnt open and we have the file.', async () => {
        const nsSetup = new nsMock()

        shouldOpenAllThePortsIfHaveOpeners.hasAdminRights = false

        nsSetup.fileExistsReturns.set("HTTPWorm.exe", true)

        nsSetup.readReturns.set(FilePaths.data.player, [JSON.stringify(player)])
        nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify([
            server1ToNotHackNotSkilledEnough,
            shouldNuke,
            shouldSkipBecauseWeHaveAdminRightsAndHackingScriptsExist,
            shouldOpenAllThePortsIfHaveOpeners
        ])])


        const ns = nsSetup as unknown
        await main(ns as NS);

        const mockedNs = ns as nsMock;

        expect(mockedNs.httpwormHostnames.length).toBe(1)
        expect(mockedNs.httpwormHostnames[0]).toBe(shouldOpenAllThePortsIfHaveOpeners.hostname)
    })

    it('should not open HTTPWorm.exe because it is open.', async () => {
        const nsSetup = new nsMock()

        shouldOpenAllThePortsIfHaveOpeners.hasAdminRights = false
        shouldOpenAllThePortsIfHaveOpeners.httpPortOpen = true

        nsSetup.fileExistsReturns.set("HTTPWorm.exe", true)

        nsSetup.readReturns.set(FilePaths.data.player, [JSON.stringify(player)])
        nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify([
            server1ToNotHackNotSkilledEnough,
            shouldNuke,
            shouldSkipBecauseWeHaveAdminRightsAndHackingScriptsExist,
            shouldOpenAllThePortsIfHaveOpeners
        ])])

        const ns = nsSetup as unknown
        await main(ns as NS);

        const mockedNs = ns as nsMock;

        expect(mockedNs.httpwormHostnames.length).toBe(0)
    })

    it('should open SQLInject because it isnt open and we have the file.', async () => {
        const nsSetup = new nsMock()

        shouldOpenAllThePortsIfHaveOpeners.hasAdminRights = false

        nsSetup.fileExistsReturns.set("SQLInject.exe", true)

        nsSetup.readReturns.set(FilePaths.data.player, [JSON.stringify(player)])
        nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify([
            server1ToNotHackNotSkilledEnough,
            shouldNuke,
            shouldSkipBecauseWeHaveAdminRightsAndHackingScriptsExist,
            shouldOpenAllThePortsIfHaveOpeners
        ])])


        const ns = nsSetup as unknown
        await main(ns as NS);

        const mockedNs = ns as nsMock;

        expect(mockedNs.sqlinjectHostnames.length).toBe(1)
        expect(mockedNs.sqlinjectHostnames[0]).toBe(shouldOpenAllThePortsIfHaveOpeners.hostname)
    })

    it('should not open SQLInject.exe because it is open.', async () => {
        const nsSetup = new nsMock()

        shouldOpenAllThePortsIfHaveOpeners.hasAdminRights = false
        shouldOpenAllThePortsIfHaveOpeners.sqlPortOpen = true

        nsSetup.fileExistsReturns.set("SQLInject.exe", true)

        nsSetup.readReturns.set(FilePaths.data.player, [JSON.stringify(player)])
        nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify([
            server1ToNotHackNotSkilledEnough,
            shouldNuke,
            shouldSkipBecauseWeHaveAdminRightsAndHackingScriptsExist,
            shouldOpenAllThePortsIfHaveOpeners
        ])])

        const ns = nsSetup as unknown
        await main(ns as NS);

        const mockedNs = ns as nsMock;

        expect(mockedNs.sqlinjectHostnames.length).toBe(0)
    })

    it('should copy the hacking scripts to the server without the scripts.', async () => {
        const nsSetup = new nsMock()

        nsSetup.readReturns.set(FilePaths.data.player, [JSON.stringify(player)])
        nsSetup.readReturns.set(FilePaths.data.environment, [JSON.stringify([
            server1ToNotHackNotSkilledEnough,
            shouldNuke,
            shouldSkipBecauseWeHaveAdminRightsAndHackingScriptsExist,
            shouldOpenAllThePortsIfHaveOpeners,
            shouldUploadScriptsBecauseAdminButDoesntHaveScriptsOnServer,
        ])])

        nsSetup.fileExistsReturns.set(FilePaths.scripts.grow + shouldSkipBecauseWeHaveAdminRightsAndHackingScriptsExist.hostname, true)
        nsSetup.fileExistsReturns.set(FilePaths.scripts.weaken + shouldSkipBecauseWeHaveAdminRightsAndHackingScriptsExist.hostname, true)
        nsSetup.fileExistsReturns.set(FilePaths.scripts.hack + shouldSkipBecauseWeHaveAdminRightsAndHackingScriptsExist.hostname, true)

        nsSetup.fileExistsReturns.set(FilePaths.scripts.grow + shouldUploadScriptsBecauseAdminButDoesntHaveScriptsOnServer.hostname, false)
        nsSetup.fileExistsReturns.set(FilePaths.scripts.weaken + shouldUploadScriptsBecauseAdminButDoesntHaveScriptsOnServer.hostname, false)
        nsSetup.fileExistsReturns.set(FilePaths.scripts.hack + shouldUploadScriptsBecauseAdminButDoesntHaveScriptsOnServer.hostname, false)

        const ns = nsSetup as unknown
        await main(ns as NS);

        const mockedNs = ns as nsMock;

        expect(mockedNs.scpArgsPassed[0][0]).toBe(JSON.stringify([FilePaths.scripts.grow, FilePaths.scripts.hack, FilePaths.scripts.weaken]))
        expect(mockedNs.scpArgsPassed[0][1]).toBe(shouldUploadScriptsBecauseAdminButDoesntHaveScriptsOnServer.hostname)
        expect(mockedNs.scpArgsPassed[0][2]).toBe("home")

        expect(mockedNs.scpArgsPassed.length).toBe(1)
    })


})