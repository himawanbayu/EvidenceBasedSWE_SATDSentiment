import { openDB } from 'idb';
//import { AppLog } from '$lib/ts/util/AppLog';
import { browser } from '$app/environment';
import type { StorageWrapB } from '$lib/ts/types/AppTypes';
import { MYP } from '$lib/ts/app/MyApp';

export class BasicDB {
    protected dbName: string;
    protected dbVersion: number;
    protected storeNames: string[];
    private myDB: ReturnType<typeof openDB> | null = null;

    constructor(dbName: string, version: number, storeNames: string[]) {
        if (storeNames.length < 1) {
            throw new Error('** no storenames provided for BasicDB');
        }
        this.dbName = dbName;
        this.dbVersion = version;
        this.storeNames = storeNames;
    }

    static async openMyDB(dbName: string, version: number, storeNames: string[]): ReturnType<typeof openDB> {
        if (storeNames.length < 1) {
            throw new Error('** no storenames provided for BasicDB.openMyDB()');
        }
        return openDB(dbName, version, {
            upgrade(db, oldVersion, newVersion, transaction, event) {
                storeNames.forEach(k => {
                    //const store = db.createObjectStore(k);
                    let boxKey: keyof StorageWrapB<Object> = 'dbKey';
                    const store = db.createObjectStore(k, { keyPath: boxKey });
                    //AppLog.debug(`Store created in db during upgrade(), name:${k}`, store);
                    MYP.debug(`Store created in db during upgrade(), name:${k}`, store);
                });
            },
        });
    }

    async getDB(): ReturnType<typeof openDB> {
        if (browser) {
            if (this.myDB == null) {
                this.myDB = BasicDB.openMyDB(this.dbName, this.dbVersion, this.storeNames);
            } else {
                const storeName = this.storeNames[0];
                try {
                    //check if store exists by trying to create transaction, if it fails try to create new objectstore
                    const tx = (await this.myDB).transaction(storeName, 'readwrite'); //readonly, readwrite and readwriteflush 
                } catch (ex) {
                    //AppLog.debug(`Store is missing from db, trying to recreate it, db:${this.dbName} store:${storeName}. Maybe the database was deleted ?`);
                    MYP.debug(`Store is missing from db, trying to recreate it, db:${this.dbName} store:${storeName}. Maybe the database was deleted ?`);
                    this.myDB = BasicDB.openMyDB(this.dbName, this.dbVersion, this.storeNames);
                }
            }
        } else {
            const msg = 'Problem, trying to get indexedDB outside browser';
            //AppLog.error(msg);
            MYP.error(msg);
            throw new Error(msg);
        }
        return this.myDB!;
    }
}
