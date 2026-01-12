export class PrepareForBatchQueue {
    constructor(
        public targets: PrepareForBatchTarget[] = []
    ){}
}

export class PrepareForBatchTarget {
    constructor(
        public target: string, 
        public targetsMoneyMax: number,
        public timeDispatched = Date.now(),
        public waitForMoreThreads = false,
        public pidsActive = true,
        public inBatchProcess = false,
    ) { }
}