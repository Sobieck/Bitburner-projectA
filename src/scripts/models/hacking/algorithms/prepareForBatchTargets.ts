export class PrepareForBatchData {
    public targets: PrepareForBatchTarget[] = []
}

export class PrepareForBatchTarget {
    constructor(
        public target: string, 
        public timeDispatched = Date.now(), 
        public preparedForBatch = false,
        public inBatchProcess = false,
        public allThreadsNeeded = false,
    ) { }
}