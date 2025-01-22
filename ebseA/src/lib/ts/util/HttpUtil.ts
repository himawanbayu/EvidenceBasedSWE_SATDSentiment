import axios from "axios";
import type { AxiosHeaderValue } from "axios";


import type { HttpRespType, IHttpRespSlim, Tuple } from "$lib/ts/types/AppTypes";
import { dbStores } from "$lib/ts/db/MyDB";
import { AppLog } from "./AppLog";
import { AppConst } from "../app/AppConst";



export class HttpUtil {

    public static async getB(url: string, allowCache: boolean = true): Promise<IHttpRespSlim> {
        let dbKey = url;
        let httpCache = dbStores.cache.httpReq;
        let respSlim: IHttpRespSlim | null = allowCache ? await httpCache.load(dbKey) : null;
        if (allowCache && respSlim) {
            AppLog.debug('httpReq found in cache, url:' + url, respSlim);
        } else {
            let respAx = await axios.get(url);
            respSlim = HttpUtil.createSlimResp(respAx);
            httpCache.save(respSlim, dbKey);
            AppLog.debug('httpReq not from cache, retrieved using axios, url:' + url, respAx, respSlim);

        }
        return respSlim;
    }
    public static async getA(url: string): Promise<HttpRespType> {
        // let dbKey = url;
        // let httpCache = dbStores.cache.httpReq;
        // let respSlim: IHttpRespSlim | null= await httpCache.load(dbKey)
        // //let respAx: HttpRespType;
        // let fromCache = false;
        // if (respSlim) {
        //     fromCache = true;
        //     AppLog.debug('httpReq found in cache, url:' + url);
        //     respB = respA;
        // } else {
        //     AppLog.debug('httpReq not in cache, doing req using axios, url:' + url);
        //     respB = await axios.get(url); // NB respA can be null, respB cant            
        //     let abc = await httpCache.save(respB, dbKey);
        //     AppLog.debug('cacheSave:', abc);
        // }

        //let resp = httpCache.load(url);
        let resp = await axios.get(url);
        return resp;
    }

    public static createSlimResp(respAx: HttpRespType): IHttpRespSlim {
        let respSlim: IHttpRespSlim = {
            data: respAx.data,
            status: respAx.status,
            statusText: respAx.statusText,
            headers: {
                cacheControl: respAx.headers['cache-control'] ? '' + (respAx.headers['cache-control']) : null,
                contentEncoding: respAx.headers['content-type'] ? '' + respAx.headers['content-type'] : null,
                contentLenght: respAx.headers['content-length'] ? '' + respAx.headers['content-length'] : null,
                contentType: respAx.headers['content-type'] ? '' + respAx.headers['content-type'] : null,
            }
        }
        return respSlim;
    }

    //public static genUrlForStaticFile('')

    public static genLocalUrl(url: string) {
        // url example /csv/satd-dataset-issues.csv , this file comes from {proj-root}/static/csv/satd-dataset-issues.csv
        return AppConst.URL_ROOT + url;
    }
}