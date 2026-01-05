export class Scripts {
    public orchestration = "scripts/runLoop/orchestration.js"
    public scriptsToRun = "scripts/runLoop/scriptsToRun.js"
}

export class Data {
    public environment = "data/runLoop/environment.json"
    public scriptsToRun = "data/runLoop/scripts-to-run.json"
    public scriptRamCost = "data/runLoop/script-ram-cost.json"
    public player = "/data/runLoop/player.json"
}

export abstract class FilePaths {
    public static scripts = new Scripts()
    public static data = new Data()
}
