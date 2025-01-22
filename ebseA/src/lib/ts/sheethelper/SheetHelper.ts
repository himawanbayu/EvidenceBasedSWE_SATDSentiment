import Papa, { type ParseError } from "papaparse";
import type { ISheetData, ISheetRow } from "../types/AppTypes";
import { MYP } from "../app/MyApp";
import { MyAppError } from "../err/MyAppError";

export class SheetHelper {
    public sheetMap: Map<string, ISheetData> = new Map(); // maps url => ISheetData, acts like a cache
    //public extractCache: Map<string, any> = new Map(); // maps

    public static parseSheetData(rawContent: string, header: boolean = true, skipEmptyLines: boolean = true): ISheetData {
        let ps = Papa.parse(rawContent, {
            header: header,
            skipEmptyLines: skipEmptyLines,
            //dynamicTyping: true,
            //skipFirstNLines:1,
        });
        let keys = ps.meta.fields ? ps.meta.fields : [];
        let rows: ISheetRow[] = ps.data ? (ps.data as ISheetRow[]) : [];
        let parseErrors: ParseError[] = ps.errors ? ps.errors : [];

        return {
            rawContent: rawContent,
            keys: keys,
            rows: rows,
            parseErrors: parseErrors,
        }
    }

    public async getSheetData(url: string): Promise<ISheetData> {// :ISheetData {

        return new Promise((resolve, reject) => {
            let sd: ISheetData;
            let res: ISheetData | undefined = this.sheetMap.get(url);
            if (res) { // cache had item => return it 
                MYP.log("done loading sheet from sheetMap: " + url, res);
                sd = res;
                resolve(sd);
            } else {
                MYP.log("loading sheet from url: " + url);
                fetch(url).then((resp) => {
                    MYP.log("done loading sheet from url, code: " + resp.status + ", url: " + url, resp);
                    if (resp.status == 200) {
                        resp.text().then((body) => {
                            sd = SheetHelper.parseSheetData(body);
                            this.sheetMap.set(url, sd);
                            resolve(sd);
                        });
                    } else {
                        //MYP.warn("finished loading sheet, status: ERR, url: " + url + ", code:" + resp.status, resp);
                        //throw new MyAppError("Error loading sheet A, url: " + url + ", code:" + resp.status, resp);
                        MYP.warn("Error loading sheet A, url: " + url, resp);
                        reject(resp);
                    }
                }).catch((err) => {
                    //throw new MyAppError("Error loading sheet B, url: " + url, err);
                    MYP.warn("Error loading sheet B, url: " + url, err);
                    reject("Error loading sheet B, url: " + url);
                });
            }
        });
    }


}

