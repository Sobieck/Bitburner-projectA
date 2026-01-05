export class DispatchQueue {
    public queue: DispatchCommand[] = []
}

export class DispatchCommand {
    constructor(
        public origin: DispatchOrigin,
        public target: string,
        public threadsWanted: number, 
        public commandType: DispatchType,
        public msAdded: number = 0,
        public effectStockMarket: boolean = false,
        public pid?: number,
    ) { }
}

export enum DispatchType {
    Weaken = "weaken",
    Grow = "grow",
    Hack = "hack"
}

export enum DispatchOrigin {
    First = "first",
}
