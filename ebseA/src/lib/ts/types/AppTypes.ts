//import type { AppConst } from "$lib/ts/app/AppConst";
import type { AxiosResponse, AxiosHeaderValue } from "axios";

export interface INavItem {
    name: string;
    url: string;
    subs: INavItem[]
}

export interface IAppSettings {
    cacheAllowRead: boolean;
    cacheAllowWrite: boolean;
    cacheMaxAgeVal: number;
    //cacheMaxAgeUnit: TypeTimeUnit, //keyof AppConst.TIME_UNIT,
    cacheMaxAgeUnit: keyof ITimeUnits;
    cacheSkipIncomplete: boolean;
}

// ****** [General] ******

export type Tuple<T, U> = [a: T, b: U]

export interface ITimeUnits {
    sec: number;
    min: number;
    hour: number;
    day: number;
    week: number;
    month: number;
    year: number;
}

export type TypeTimeUnit = keyof ITimeUnits;


// ****** [Sheets] ******

export enum SheetType {
    Unknown = 10, CodeComment = 20, CommitMsg = 30, Issue = 40, PullReq = 50
}


export interface ISheetItem {
    name: string;
    url: string;
    type: SheetType;
    //content: string | null;
}

export interface ISheetData {
    rawContent: string;
    keys: string[];
    rows: ISheetRow[];
    parseErrors: any[];
}

// export interface ISheetDataB {
//     rawContent: string;
//     keys: string[];
//     rows: any[];
// }

export interface ISheetRow {
    [key: string]: any
}

// ****** [HTTP types] ******

export type HttpRespType = AxiosResponse<any, any>;

export interface IHttpRespSlim {
    data: string,
    //headers
    status: number,
    statusText: string,
    headers: {
        cacheControl: string | null,
        contentEncoding: string | null,
        contentLenght: string | null,
        contentType: string | null,
    }
}

// ****** [DB & storage types] ******

export type StorageObjType = '' | 'httpReq'; // |'octokit' | 'workspace' | 'object';

export interface StorageWrapB<T> {
    dbKey: string;
    ts: number; // ts:timestamp
    obj: T;
    objType: StorageObjType;
}

// ****** [Jira] ******


export interface IJiraIssueComment {
    text: string;
    created: string;
    author: string;
}
export interface IJiraIssue {
    //url: string;
    project: string;
    issueNr: string,
    // id: string;
    summary: string;// | null;
    description: string;// | null;
    created: string;
    updated: string;
    resolved: string;
    comments: IJiraIssueComment[];
}

// ****** [indexedDB] ******
export type StoreItemIterFunc<T> = (wrap: StorageWrapB<T>, key: IDBValidKey) => Promise<any>;


// ****** [GeneralTable] ******
// export interface IGeneralTableData {

// }
