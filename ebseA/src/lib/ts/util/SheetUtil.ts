import { generateCsv, mkConfig, type CsvOutput } from "export-to-csv";
import type { ISheetData, ISheetItem } from "../types/AppTypes";

export class SheetUtil {
    public static countUniqueColValues(sheetData: ISheetData, key: string): Map<string, number> {
        let map: Map<string, number> = new Map();
        sheetData.rows.forEach((row) => {
            let projName: string = row[key] ? row[key] : "";
            if (projName) {
                if (map.has(projName)) {
                    map.set(projName, (map.get(projName) as number) + 1);
                } else {
                    map.set(projName, 1);
                }
            }
        });
        return map;
    }

    public static extractIssueNumber(sheetItem: ISheetItem, sheetData: ISheetData, sort: boolean = false, projNamesToInclude: string[] | null = null): Map<string, string[]> {
        let map: Map<string, string[]> = new Map();
        let ka = 'project';
        let kb = 'issue_number';
        //let jiraProjects = ['camel', 'hadoop', 'hbase', 'impala', 'thrift']; // chromium, gerrit

        //let allowed
        if (!sheetData.keys.includes(ka) || !sheetData.keys.includes(ka)) {
            return map;
        }

        let func = function (projName: string) { //}, issueNr: string) {
            if (!projName) { // || isNaN(Number(issueNr))) {
                return false;
            }
            return Array.isArray(projNamesToInclude) ? projNamesToInclude.includes(projName) : true;
        };

        sheetData.rows
            //.filter(row => row[ka] && jiraProjects.includes(row[ka]))
            .filter(row => func(row[ka])) // && jiraProjects.includes(row[ka]))
            .forEach((row) => {
                let projName: string = row[ka] ? row[ka] : "";
                let valA: string = row[kb] ? row[kb] : "";
                //let valB: Number = Number(valA);

                let arr = map.get(projName);
                let issueArr: string[] = arr ? arr : [];
                if (valA && !issueArr.includes(valA)) {
                    issueArr.push(valA)
                }
                if (!arr) {
                    // array not yet in map => add it to map
                    map.set(projName, issueArr);
                }
            });
        if (sort) {
            map.forEach((val, key, map) => {
                val.sort((a, b) => Number(a) - Number(b));
            });
        }

        return map;
    }
    public static genCsv(rowObjs: any[]): CsvOutput {
        let arr = rowObjs;
        const csvConfig = mkConfig({ useKeysAsHeaders: true });
        const rawCsv = generateCsv(csvConfig)(arr);
        return rawCsv;
    }
}