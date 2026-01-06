export class Scripts {
    public orchestration = "scripts/runLoop/orchestration.js"
    public scriptsToRun = "scripts/runLoop/scriptsToRun.js"

    public grow = "scripts/hacking/grow.js"
    public hack = "scripts/hacking/hack.js"
    public weaken = "scripts/hacking/weaken.js"
}

export class Data {
    public environment = "data/runLoop/environment.json"
    public scriptsToRun = "data/runLoop/scripts-to-run.json"
    public scriptRamCost = "data/runLoop/script-ram-cost.json"
    public player = "data/runLoop/player.json"
    public dispatchQueue = "data/hacking/dispatch/dispatch-queue.json"
}

export abstract class FilePaths {
    public static scripts = new Scripts()
    public static data = new Data()
}
