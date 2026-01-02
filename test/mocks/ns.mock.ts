export class nsMock {

  public callOrder: string[] = [];



  public sleepAmount: number[] = [];

  public async sleep(millis: number): Promise<true> {
    this.callOrder.push("sleep")

    this.sleepAmount.push(millis)

    return await true;
  }


  public writeTuples: [string, string, string][] = []

  public write(filename: string, data: string, mode: string): void {
    this.callOrder.push("write")

    this.writeTuples.push([filename, data, mode])
  }
}