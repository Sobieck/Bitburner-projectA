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
}