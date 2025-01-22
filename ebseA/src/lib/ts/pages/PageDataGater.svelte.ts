import { AppCfg } from "../app/AppCfg";
import type { SheetItem } from "../structs/SheetItem";
import { TableDataA } from "../structs/TableDataA.svelte";
import type { TaskGroup } from "../task/TaskGroup.svelte";

export class PageDataGater {
    public mySheets: SheetItem[] = AppCfg.MY_SHEETS;
    public tableA: TableDataA = new TableDataA();
    public taskGroup: TaskGroup<string> | null = null;
    public doWork: boolean = $state(false);
    public timerId:any = null;
}



// import { AppCfg } from "$lib/ts/app/AppCfg";
// import type { SheetItem } from "$lib/ts/structs/SheetItem";

// export class PageDataCsv {
//     public mySheets: SheetItem[];
//     public activeSheet: SheetItem | null = null;

//     constructor() {
//         this.mySheets = AppCfg.MY_SHEETS;
//     }
// }