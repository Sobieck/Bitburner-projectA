import { NS } from "@ns";

export abstract class Utilities {
    public static readAndParse <T>(ns: NS, path: string) : T {
        return JSON.parse(ns.read(path)) as T
    }
}