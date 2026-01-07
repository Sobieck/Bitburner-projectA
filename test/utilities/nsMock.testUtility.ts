import { FilePaths } from "../../src/scripts/models/filePaths"

export class nsMock {

  public callOrder: string[] = [];
  public args: (string | number | boolean)[] = []



  public sleepAmounts: number[] = [];

  public async sleep(millis: number): Promise<true> {
    this.callOrder.push("sleep")

    this.sleepAmounts.push(millis)

    return await true;
  }



  public writeTuples: [string, string, string][] = []

  public write(filename: string, data: string, mode: string): void {
    this.callOrder.push("write")

    this.writeTuples.push([filename, data, mode])
  }



  public runTuples: [string, number?, (string | number | boolean)?][] = []

  public run(script: string, threads?: number, args?: (string | number | boolean)): number {
    this.callOrder.push("run")

    this.runTuples.push([script, threads, args])

    return 1
  }



  public readFilenames: string[] = []

  public readReturns = new Map<string, string[]>()
  private readCount = new Map<string, number>()

  public read(filename: string): string {
    this.callOrder.push("read")

    this.readFilenames.push(filename)

    let readCount = this.readCount.get(filename)

    if (readCount === undefined) {
      readCount = 0
      this.readCount.set(filename, readCount + 1)
    }

    return this.readReturns.get(filename)![readCount]
  }



  public scanHostnames: (string | undefined)[] = []
  public scanReturns = new Map<(string | undefined), string[]>()

  public scan(hostname?: string): string[] {
    this.callOrder.push("scan")

    this.scanHostnames.push(hostname)

    return this.scanReturns.get(hostname)!;
  }



  public getServerReturns = new Map<(string | undefined), { hostname: string, hackDifficulty?: number }>()
  public getServerHosts: (string | undefined)[] = []

  public getServer(host?: string) {
    this.callOrder.push("getServer")
    this.getServerHosts.push(host)

    return this.getServerReturns.get(host)
  }



  public lsReturns = new Map<string, Map<string, string[]>>()
  public ls(host: string, substring: string): string[] {
    this.callOrder.push("ls")

    return this.lsReturns.get(host)?.get(substring)!
  }



  public getScriptRamReturns = new Map<string, number>()
  public getScriptRam(script: string): number {
    this.callOrder.push("getScriptCost")

    return this.getScriptRamReturns.get(script)!
  }



  public getPlayerReturns = {}
  public getPlayer() {
    this.callOrder.push("getPlayer")

    return this.getPlayerReturns
  }



  public nukeHostnames: string[] = []
  public nuke(hostname: string) {
    this.callOrder.push("nuke")

    this.nukeHostnames.push(hostname)
  }



  public fileExistsReturns = new Map<string, boolean>()
  public fileExists(fileName: string, hostname: string = ""): boolean {
    this.callOrder.push("fileExists")

    let result = this.fileExistsReturns.get(fileName + hostname)

    if (result === undefined) {
      result = false
    }

    return result
  }



  public brutesshHostnames: string[] = []
  public brutessh(hostname: string) {
    this.callOrder.push("brutessh")

    this.brutesshHostnames.push(hostname)
  }



  public ftpcrackHostnames: string[] = []
  public ftpcrack(hostname: string) {
    this.callOrder.push("ftpcrack")

    this.ftpcrackHostnames.push(hostname)
  }



  public relaysmtpHostnames: string[] = []
  public relaysmtp(hostname: string) {
    this.callOrder.push("relaysmtp")

    this.relaysmtpHostnames.push(hostname)
  }



  public httpwormHostnames: string[] = []
  public httpworm(hostname: string) {
    this.callOrder.push("httpworm")

    this.httpwormHostnames.push(hostname)
  }



  public sqlinjectHostnames: string[] = []
  public sqlinject(hostname: string) {
    this.callOrder.push("sqlinject")

    this.sqlinjectHostnames.push(hostname)
  }



  public hackArgsPassed: [string, { stock: boolean, additionalMsec: number }][] = []
  public hack(hostname: string, opts: { stock: boolean, additionalMsec: number }) {
    this.callOrder.push("hack")

    this.hackArgsPassed.push([hostname, opts])
  }



  public weakenArgsPassed: [string, { stock: boolean, additionalMsec: number }][] = []
  public weaken(hostname: string, opts: { stock: boolean, additionalMsec: number }) {
    this.callOrder.push("weaken")

    this.weakenArgsPassed.push([hostname, opts])
  }



  public growArgsPassed: [string, { stock: boolean, additionalMsec: number }][] = []
  public grow(hostname: string, opts: { stock: boolean, additionalMsec: number }) {
    this.callOrder.push("grow")

    this.growArgsPassed.push([hostname, opts])
  }



  public execArgsPassed: [string, string, number, (string | number | boolean)[]][] = []
  public execResponses = new Map<string, number[]>()
  private execResponseIndex = new Map<string, number>()
  public exec(script: string, host: string, threadOrOptions: number, ...args: (string | number | boolean)[]): number {
    this.callOrder.push("exec")

    this.execArgsPassed.push([script, host, threadOrOptions, args])

    let responseIndex = this.execResponseIndex.get(script)

    if (responseIndex === undefined) {
      responseIndex = 0
    }

    this.execResponseIndex.set(script, responseIndex + 1)

    return this.execResponses.get(script)![responseIndex]
  }



  public isRunningResponses = new Map<number, boolean>()
  public isRunning(pid: number): boolean {
    this.callOrder.push("isRunning")

    return this.isRunningResponses.get(pid)!
  }



  public mvArgsPassed: [string, string, string][] = []
  public mv(host: string, source: string, destination: string) {
    this.callOrder.push("mv")

    this.mvArgsPassed.push([host, source, destination])
  }



  public scpArgsPassed: [string, string, string][] = []
  public scp(files: string[], destination: string, source: string) {
    this.callOrder.push("scp")

    this.scpArgsPassed.push([JSON.stringify(files), destination, source])
  }
}