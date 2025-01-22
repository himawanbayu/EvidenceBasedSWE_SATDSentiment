import type { StorageWrapB, StorageObjType, StoreItemIterFunc } from "$lib/ts/types/AppTypes";
import { myDB } from "$lib/ts/db/MyDB";
import { TimeUtil } from "$lib/ts/util/TimeUtil";
import { MYP } from "$lib/ts/app/MyApp";


// NB all items stored/loaded, are wrapped inside a wrap object, see createWrap()
export class StorageFuncGroup<T> {
    protected storeName: string;//storeName
    protected objType: StorageObjType;
    protected isCacheStorage: boolean; // stores if this is a cache... if true settings.cacheAllowWrite will enforced

    constructor(storeName: string, objType: StorageObjType = '', isCache = false) {
        this.storeName = storeName
        this.objType = objType
        this.isCacheStorage = isCache;
    }

    public async loadWrap(key: string): Promise<StorageWrapB<T> | null> {
        if (this.isCacheStorage && !MYP.settings.cacheAllowRead) {
            return null;
        }
        return (await myDB.getDB()).get(this.storeName, key);
    }

    public async saveWrap(box: StorageWrapB<T>, key: string) {
        if (this.isCacheStorage && !MYP.settings.cacheAllowWrite) {
            return null;
        }
        return (await myDB.getDB()).put(this.storeName, box);
    }

    public async delete(key: string): Promise<void> {
        if (this.isCacheStorage && !MYP.settings.cacheAllowWrite) {
            return;
        }
        return (await myDB.getDB()).delete(this.storeName, key);
    }

    public async getKeys(): Promise<string[]> {
        if (this.isCacheStorage && !MYP.settings.cacheAllowRead) {
            return [];
        }
        let arr = (await myDB.getDB()).getAllKeys(this.storeName);
        return (await arr).map((item) => `${item}`)
    }

    public async count(): Promise<number> {
        if (this.isCacheStorage && !MYP.settings.cacheAllowRead) {
            return 0;
        }
        return (await myDB.getDB()).count(this.storeName);
    }

    // public async countKeyEntries(key:string): Promise<number> {
    //     if (this.isCacheStorage && !MYP.settings.cacheAllowRead) {
    //         return 0;
    //     }
    //     return (await myDB.getDB()).count(this.storeName, key);
    // }

    public async load(key: string): Promise<T | null> {
        let wrap = await this.loadWrap(key);
        return wrap == null ? null : wrap.obj;
    }

    public async save(val: T, key: string): Promise<IDBValidKey | null> {
        // lines below not needed, check is dont by this.saveWrap()
        // if (this.isCacheStorage && !MYP.settings.cacheAllowWrite) {
        //     return null;
        // }
        let wrap = this.createWrap(val, key)
        return this.saveWrap(wrap, key);
    }

    // public async blabla(key:string) {
    //     if (this.isCacheStorage && !MYP.settings.cacheAllowRead) {
    //         return false;
    //     }
    //     return (await myDB.getDB()).;
    // }

    public async iterateStoreEntries(func: null | StoreItemIterFunc<T> = null) {
        //inspired by: https://github.com/jakearchibald/idb?tab=readme-ov-file#async-iterators
        if (this.isCacheStorage && !MYP.settings.cacheAllowRead) {
            return false;
        }
        //return (await myDB.getDB()).;
        let promArr: Promise<any>[] = [];
        const tx = (await myDB.getDB()).transaction(this.storeName)
        for await (const cursor of tx.store) {
            if (func) {
                let prom = func(cursor.value, cursor.key);
                promArr.push(prom);
            } else {
                MYP.debug("iterateStoreEntries() entry: ", cursor.key, cursor.value, cursor);
            }
            cursor.advance(1); // Skip the next item
        }
        MYP.debug("@@ cursor done", promArr.length);
        return Promise.allSettled(promArr);
    }

    public createWrap(val: T, key: string): StorageWrapB<T> {
        return {
            dbKey: key,
            ts: TimeUtil.getTimestamp(),
            obj: val,
            objType: this.objType,
        };
    }
}

//const myDB = new MyDB();





