import { MYP } from "../app/MyApp";
import { dbStores } from "../db/MyDB";
import type { IHttpRespSlim, IJiraIssue, StorageWrapB, StoreItemIterFunc } from "../types/AppTypes";
import { JiraUtil } from "../util/JiraUtil";

export class JiraHelper {
    public issueMap: Map<string, IJiraIssue> = new Map(); // maps '{projectis}-{isueNr}' => IJiraIssue; filled from httpCache xml data;

    public async importCachedIssuesA() {
        this.issueMap.clear();
        await JiraHelper.importCachedIssuesB(this.issueMap);
        return this.issueMap;
    }

    public static async importCachedIssuesB(map: Map<string, IJiraIssue>) {
        let cnt = 0;
        let func = function (wrap: StorageWrapB<IHttpRespSlim>, key: IDBValidKey) {
            let url = "" + key;
            let parts = url.toString().split("/");
            if (parts.length > 0) {
                let name = parts[parts.length - 1];
                name = name.split('.')[0]; // remove '.xml'
                let rawXml = wrap.obj.data;
                let issueObj = JiraUtil.processIssueXml(url, rawXml);
                map.set(name, issueObj);
                cnt++;
                //MYP.log('finished importing jira, issue: ' + name, ', cnt: ' + cnt);
                return new Promise((resolve, reject) => {
                    resolve(issueObj);
                });
            } else {
                return new Promise((resolve, reject) => {
                    reject(null);
                });
            }
        };
        await dbStores.cache.httpReq.iterateStoreEntries(func);
    }
}