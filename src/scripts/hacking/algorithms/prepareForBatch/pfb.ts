
import { NS } from "@ns";
import { FilePaths } from "/scripts/constants";
import { DispatchBatch, DispatchCommand, DispatchOrigin, DispatchQueue, DispatchType } from "/scripts/models/hacking/dispatch/dispatchQueue";
import { Utilities } from "/scripts/utilities";
import { ServerWithAdditionalInfo } from "/scripts/models/runLoop/serverWithAdditionalInfo";
import { PrepareForBatchQueue, PrepareForBatchTarget } from "/scripts/models/hacking/algorithms/prepareForBatchTargets";

export async function main(ns: NS): Promise<void> {


    const dispatchQueue = Utilities.readAndParse<DispatchQueue>(ns, FilePaths.data.dispatchQueue)

    if (dispatchQueue.batches.filter(x => x.dispatched === false).length > 0) {
        return
    }

    const environment = Utilities.readAndParse<ServerWithAdditionalInfo[]>(ns, FilePaths.data.environment)

    const possibleWeakenOrGrowThreads = environment.filter(x => x.possibleWeakenOrGrowThreads > 0).map(x => x.possibleWeakenOrGrowThreads).reduce((a, b) => a + b, 0)
    const possibleHackThreads = environment.filter(x => x.possibleWeakenOrGrowThreads > 0).map(x => x.possibleHackThreads).reduce((a, b) => a + b, 0)

    if (possibleWeakenOrGrowThreads < 11) {
        return
    }

    const prepareForBatchQueue = Utilities.readAndParse<PrepareForBatchQueue>(ns, FilePaths.data.prepareForBatchQueue)

    prepareForBatchQueue.targets = prepareForBatchQueue.targets.sort((a, b) => b.targetsMoneyMax - a.targetsMoneyMax)

    let prepareForBatchData: PrepareForBatchData | undefined;

    for (const target of prepareForBatchQueue.targets.filter(x => x.pidsActive === false && x.inBatchProcess === false)) {
        const targetServer = environment.filter(x => x.hostname === target.target).pop()

        prepareForBatchData = selectActionType(targetServer)

        if (prepareForBatchData && prepareForBatchData.maxMoney) {

            const countOfLowerPriorityProcessesUsingResources = prepareForBatchQueue.targets
                .filter(x =>
                    prepareForBatchData?.maxMoney &&
                    x.targetsMoneyMax < prepareForBatchData.maxMoney &&
                    x.pidsActive
                ).length

            if (
                (prepareForBatchData.type === DispatchType.Grow && possibleWeakenOrGrowThreads < prepareForBatchData.threadsNeeded) ||
                (prepareForBatchData.type === DispatchType.Hack && possibleHackThreads < prepareForBatchData.threadsNeeded) ||
                (prepareForBatchData.type === DispatchType.Weaken && possibleWeakenOrGrowThreads < prepareForBatchData.threadsNeeded)) {

                if (countOfLowerPriorityProcessesUsingResources > 0) {
                    target.waitForMoreThreads = true
                    prepareForBatchData.waitForMoreThreads = true
                    break
                }
            }

            target.waitForMoreThreads = false
            target.pidsActive = true
            break
        }
    }

    if (prepareForBatchData === undefined) {
        const targetServer = environment
            .filter(x =>
                x.hasAdminRights &&
                x.moneyMax && x.moneyMax > 0 &&
                prepareForBatchQueue.targets.map(x => x.target).includes(x.hostname) === false
            )
            .sort((a, b) => a.randomValueForShuffle - b.randomValueForShuffle)
            .pop()


        prepareForBatchData = selectActionType(targetServer)

        if (prepareForBatchData) {
            prepareForBatchQueue.targets.push(new PrepareForBatchTarget(prepareForBatchData.hostname, prepareForBatchData.maxMoney))
        }
    }

    if (prepareForBatchData) {
        if (prepareForBatchData.waitForMoreThreads === false) {
            dispatchQueue.batches.push(
                new DispatchBatch(DispatchOrigin.PrepareForBatch, prepareForBatchData.hostname, [
                    new DispatchCommand(prepareForBatchData.threadsNeeded, prepareForBatchData.type)
                ])
            )

            Utilities.write(ns, FilePaths.data.dispatchQueue, dispatchQueue)
        }

        Utilities.write(ns, FilePaths.data.prepareForBatchQueue, prepareForBatchQueue)
    }
}

function selectActionType(targetServer: ServerWithAdditionalInfo | undefined): PrepareForBatchData | undefined {

    let prepareForBatchData: PrepareForBatchData | undefined;


    if (targetServer &&
        targetServer.moneyMax &&
        targetServer.hackDifficulty &&
        targetServer.minDifficulty &&
        targetServer.threadsToReduceToMinDifficulty &&
        targetServer.threadsToIncreaseToMaxMoney
    ) {
        
        if (targetServer.moneyAvailable === undefined) {
            targetServer.moneyAvailable = 0
        }

        if (targetServer.hackDifficulty > targetServer.minDifficulty) {
            const numberOfThreads = targetServer.threadsToReduceToMinDifficulty.filter(x => x.numberOfCores === 1).pop()

            if (numberOfThreads) {
                prepareForBatchData = new PrepareForBatchData(
                    targetServer.hostname,
                    numberOfThreads.threadsNeeded,
                    DispatchType.Weaken,
                    targetServer.moneyMax
                )
            }
        } else if (targetServer.hackDifficulty === targetServer.minDifficulty && targetServer.moneyAvailable < targetServer.moneyMax) {
            const numberOfThreads = targetServer.threadsToIncreaseToMaxMoney.filter(x => x.numberOfCores === 1).pop()

            if (numberOfThreads) {
                prepareForBatchData = new PrepareForBatchData(
                    targetServer.hostname,
                    numberOfThreads.threadsNeeded,
                    DispatchType.Grow,
                    targetServer.moneyMax
                )
            }

        } else if (targetServer.hackDifficulty === targetServer.minDifficulty && targetServer.moneyAvailable === targetServer.moneyMax && targetServer.threadsToHackMoneyAvailable) {
            prepareForBatchData = new PrepareForBatchData(
                targetServer.hostname,
                targetServer.threadsToHackMoneyAvailable,
                DispatchType.Hack,
                targetServer.moneyMax
            )
        }

    }

    return prepareForBatchData
}

class PrepareForBatchData {
    constructor(
        public hostname: string,
        public threadsNeeded: number,
        public type: DispatchType,
        public maxMoney: number,
        public waitForMoreThreads = false,
    ) { }
}