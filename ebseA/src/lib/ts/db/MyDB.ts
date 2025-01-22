import type { IHttpRespSlim } from "$lib/ts/types/AppTypes";
import { BasicDB } from "$lib/ts/db/BasicDB";
import { StorageFuncGroup } from "$lib/ts/db/StorageFuncGroup";

let myStoreNames: string[] | undefined = ['ebse_main', 'ebse_cache'];
const cfg = {
    db: {
        dbName: 'ebse_db',
        dbVersion: 1,
        mainStoreName: myStoreNames[0],
        cacheStoreName: myStoreNames[1],
        allStoreNames: myStoreNames,
    }
}
myStoreNames = undefined; // unset to prevent accidental usage

export class MyDB extends BasicDB {
    constructor() {
        super(cfg.db.dbName, cfg.db.dbVersion, cfg.db.allStoreNames);
    }

    public static createExpObj() {
        return {
            main: new StorageFuncGroup<Object>(cfg.db.mainStoreName),
            cache: {
                httpReq: new StorageFuncGroup<IHttpRespSlim>(cfg.db.cacheStoreName, 'httpReq', true),
            } 
        }
    }
}

export let myDB = new MyDB();
export let dbStores = MyDB.createExpObj();
//let aaa = await dbStores.workspace.load('aaa');
