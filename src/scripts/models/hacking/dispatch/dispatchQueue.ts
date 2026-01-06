export class DispatchQueue {
    constructor(public queue: DispatchBatch[] = []) { }
}

export class DispatchBatch {
    constructor(
        public origin: DispatchOrigin,
        public target: string,
        public dispatchCommands: DispatchCommand[],
        public allOrNothing = false,
        public dispatched = false,
    ) { }
}

export class DispatchCommand {
    constructor(
        public threadsWanted: number,
        public commandType: DispatchType,
        public msAdded: number = 0,
        public effectStockMarket: boolean = false,
        public pids?: number[],
        public threadsExecuting?: number
    ) { }
}

export enum DispatchType {
    Weaken = "scripts/hacking/weaken.js",
    Grow = "scripts/hacking/grow.js",
    Hack = "scripts/hacking/hack.js",
}

export enum DispatchOrigin {
    First = "first",
    Batch = "batch",
}
