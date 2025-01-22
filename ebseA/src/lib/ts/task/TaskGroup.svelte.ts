export class TaskGroup<T> {
    name: string = $state('');
    allTasks: T[] = $state([]);
    pendingTaks: T[] = $state([]);
    maxErrCnt: number = $state(0);
    pendingIdx: number = $state(0);
    errCnt: number = $state(0);
    workTokens: number = $state(0);


    constructor(name: string, allTasks: T[], pendingTaks: T[], maxErrCnt: number = 5, tokenCnt: number = 3) {
        this.name = name;
        this.allTasks = allTasks;
        this.pendingTaks = pendingTaks;
        this.maxErrCnt = maxErrCnt;
        this.workTokens = tokenCnt;
    }

    public static forProjectMap(name: string, projMap: Map<String, String[]>, maxErrCnt: number = 5, tokenCnt: number = 3) {
        let map = projMap;

        let arr: string[] = [];

        map.forEach((issueArr, projName, map) => {

            issueArr.forEach((issueNr) => {
                let id = ('' + projName + '-' + issueNr).toUpperCase()
                arr.push(id);
            })
        });
        return new TaskGroup<string>(name, arr, arr, maxErrCnt, tokenCnt);
    }
}

