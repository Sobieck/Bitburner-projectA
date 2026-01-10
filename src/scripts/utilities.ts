import { NS } from "@ns";

export abstract class Utilities {
    public static readAndParse <T>(ns: NS, path: string) : T {
        return JSON.parse(ns.read(path)) as T
    }

    public static write(ns: NS, path: string, objectToSave: any) : void {
        ns.write(path, JSON.stringify(objectToSave), "w")
    }
}