import { browser } from "$app/environment";
import { AppLog } from "$lib/ts/util/AppLog";
import { dbStores } from "$lib/ts/db/MyDB";
import { TimeUtil } from "$lib/ts/util/TimeUtil";
import { AppSettings } from "$lib/ts/app/AppSettings";
import { SheetHelper } from "$lib/ts/sheethelper/SheetHelper";
import { VolatileState } from "$lib/ts/app/VolatileState.svelte";
import { JiraHelper } from "../jira/JiraHelper";

//bootstrap: AppConst, AppCfg, MyApp, layout.svelte
class MyApp {
    //public lastMsg: string = '';
    public volState: VolatileState = new VolatileState();
    public settings: AppSettings = new AppSettings();
    public sheetHelper: SheetHelper = new SheetHelper();
    public jiraHelper: JiraHelper = new JiraHelper();

    protected inBrowser: boolean = browser;
    protected isInit: boolean = false;

    public constructor() {
        this.debug("MyApp constr() finished, inBrowser: " + (this.inBrowser ? 'yes' : 'no'));
    }

    public async bootstrap() {
        if (this.isInit) {
            this.warn("MyApp already initialized");
            return;
        }
        this.isInit = true;

        if (this.inBrowser) {
            //await this.initStores();
            this.initStores();
        }
        this.log("MyApp.bootstrap() finished")
    }

    protected async initStores() {
        let main = dbStores.main;
        let cache = dbStores.cache;
        let pa = main.count(); // this will trigger getDB(), which will trigger db-creation
        let pb = cache.httpReq.count(); // this will trigger getDB(), which will trigger db-creation
        //await pa;await pb;
        Promise.all([pa, pb]).then((vals) => this.debug('MyApp.initStores() done', vals));
        //this.debug('initStores() done', arr);
        //this.log('zzz stores', dbStores, main, cache);
    }

    public noop() {
        // do nothing
    }

    /***** log proxy funcs below *****/
    public debug(text: string = '', ...extra: any[]) {
        //this.vs.lastMsg = this.fixLastMsg(text, '');// 'debug'); 
        AppLog.debug(text, ...extra)
    }

    public log(text: string = '', ...extra: any[]) {
        this.volState.lastMsg = this.fixLastMsg(text, ''); // 'log');
        AppLog.log(text, ...extra)
    }

    public warn(text: string = '', ...extra: any[]) {
        this.volState.lastMsg = this.fixLastMsg(text, 'warn');
        AppLog.warn(text, ...extra)
    }

    public error(text: string = '', ...extra: any[]) {
        this.volState.lastMsg = this.fixLastMsg(text, 'error');
        AppLog.error(text, ...extra)
    }

    protected fixLastMsg(text: string, level: string) {
        let keys: string[] = level ? [TimeUtil.getCurTimeReadable(), level] : [TimeUtil.getCurTimeReadable()];
        //let keys: string[] = [TimeUtil.getCurTimeReadable()];
        let str: string = '[' + keys.join('][') + '] ' + text;
        return str;
    }
}


export const MYP: MyApp = new MyApp();
MYP.bootstrap();
//MYP.bootstrap();
