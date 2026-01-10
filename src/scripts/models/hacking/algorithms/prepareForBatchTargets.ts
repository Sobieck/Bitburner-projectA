export class PrepareForBatchData {
    public targets: PrepareForBatchTarget[] = []
}

export class PrepareForBatchTarget {
    constructor(
        public target: string, 
        public timeDispatched = Date.now(), 
        public allThreadsNeeded = false,
        public pidsActive = false,
        public inBatchProcess = false,
    ) { }
}