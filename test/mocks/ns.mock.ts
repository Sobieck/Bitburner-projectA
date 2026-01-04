export class nsMock {

  public callOrder: string[] = [];



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
  private readCount = 0

  public read(filename: string): string {
    this.callOrder.push("read")

    this.readFilenames.push(filename)

    this.readCount++
    return this.readReturns.get(filename)![this.readCount - 1]
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
  public ls(host: string, substring: string): string[]{
    this.callOrder.push("ls")
    
    return this.lsReturns.get(host)?.get(substring)!
  }



  public getScriptRamReturns = new Map<string, number>()
  public getScriptRam(script: string) : number {
    this.callOrder.push("getScriptCost")

    return this.getScriptRamReturns.get(script)!
  }

}