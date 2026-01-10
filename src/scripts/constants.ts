export class ScriptPaths {
    public orchestration = "scripts/runLoop/orchestration.js"
    public scriptsToRun = "scripts/runLoop/scriptsToRun.js"

    public grow = "scripts/hacking/grow.js"
    public hack = "scripts/hacking/hack.js"
    public weaken = "scripts/hacking/weaken.js"
}

export class DataPaths {
    public environment = "data/runLoop/environment.json"
    public scriptsToRun = "data/runLoop/scripts-to-run.json"
    public scriptRamCost = "data/runLoop/script-ram-cost.json"
    public player = "data/runLoop/player.json"
    
    public dispatchQueue = "data/hacking/dispatch/dispatch-queue.json"
    public prepareForBatchQueue = "data/hacking/algorithms/prepareForBatch/pfb-queue.json"
    public batchQueue = "data/hacking/algorithms/batch/batch-queue.json"
}

export abstract class FilePaths {
    public static scripts = new ScriptPaths()
    public static data = new DataPaths()
}


export abstract class Constants {
    public static ratioOfMoneyMaxToLeaveOnTheServer = 0.05
}