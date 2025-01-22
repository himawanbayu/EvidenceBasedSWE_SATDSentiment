import type { ISheetRow } from "../types/AppTypes";

export class TableDataA {
    public showTable: boolean = $state(false);
    public colTitles: string[] = $state([]);
    public rowKeys: string[] = $state([]);
    public rowObjs: ISheetRow[] = $state([]);

    constructor(showTable: boolean = false, colTitles: string[] = [], rowKeys: string[] = [], rowObjs: ISheetRow[] = []) {
        this.setAll(showTable, colTitles, rowKeys, rowObjs)
    }

    public setAll(showTable: boolean = false, colTitles: string[], rowKeys: string[], rowObjs: ISheetRow[]) {
        this.showTable = showTable;
        this.colTitles = colTitles;
        this.rowKeys = rowKeys;
        this.rowObjs = rowObjs;
    }

    public clear() {
        this.showTable = false;
        this.colTitles = [];
        this.rowKeys = [];
        this.rowObjs = [];
    }



    public static exampleA() {
        return new TableDataA(
            true,
            ["NameZ", "ValueZ"],
            ["a", "b"],
            [
                { a: 123, b: 456 },
                { a: "aaa", b: "bbb" },
            ],);
    }
}