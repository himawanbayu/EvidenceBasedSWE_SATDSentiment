<script lang="ts">
    import StatusBar from "$lib/components/general/StatusBar.svelte";
    import { AppCfg } from "$lib/ts/app/AppCfg";
    import { MYP } from "$lib/ts/app/MyApp";
    import { dbStores } from "$lib/ts/db/MyDB";
    import { PageDataGater } from "$lib/ts/pages/PageDataGater.svelte";
    import type { SheetItem } from "$lib/ts/structs/SheetItem";
    import { TableDataA } from "$lib/ts/structs/TableDataA.svelte";
    import { TaskGroup } from "$lib/ts/task/TaskGroup.svelte";
    import type { IHttpRespSlim, ISheetData, ISheetItem } from "$lib/ts/types/AppTypes";
    import { HttpUtil } from "$lib/ts/util/HttpUtil";
    import { JiraUtil } from "$lib/ts/util/JiraUtil";
    import { SheetUtil } from "$lib/ts/util/SheetUtil";

    // interface IPageDataGater {
    //     mySheets: SheetItem[];
    //     tableA: TableDataA;
    //     taskGroup: TaskGroup<string> | null;
    // }

    // let pdOLD: IPageDataGater = {
    //     // pd: pageData
    //     mySheets: AppCfg.MY_SHEETS,
    //     //tableA: TableDataA.exampleA(),
    //     tableA: new TableDataA(),
    //     taskGroup: null,
    // };

    let pd = new PageDataGater();
    let timerId: number = 0;

    function onClickCsv(sheet: ISheetItem) {
        let prom = MYP.sheetHelper.getSheetData(sheet.url);
        prom.then((sd: ISheetData) => {
            onLoadSheetData(sheet, sd);
        });
    }

    function setTaskGroup(tg: TaskGroup<string>) {
        pd.taskGroup = tg;
    }

    function onLoadSheetData(sheetItem: ISheetItem, sheetData: ISheetData) {
        let sort = false;
        let projNamesToInclude = ["camel", "hadoop", "hbase", "impala", "thrift"]; // include only
        let map = SheetUtil.extractIssueNumber(sheetItem, sheetData, sort, projNamesToInclude);
        let tg = TaskGroup.forProjectMap(sheetItem.name, map, 5);
        setTaskGroup(tg);
        MYP.log("onLoadSheetData()", map, tg);
    }

    async function onClickStart() {
        let tg = pd.taskGroup;
        if (pd.doWork) {
            MYP.log("Already working, no need to start.");
            return;
        } else if (!tg) {
            MYP.log("No task selected, cant start");
            return;
        } else if (!tg.pendingTaks) {
            MYP.log("No tasks pending, cant start");
        }
        MYP.log("Starting work on task: " + tg.name);
        pd.doWork = true;

        let urlList = tg.pendingTaks;

        let startIdx = 0;
        let endIdx = 3000;
        let intervalTime = 5000;

        let idx = startIdx;
        let func = function () {
            if (idx >= endIdx || !pd.doWork) {
                MYP.log("finished work");
                onClickStop();
                return;
            }

            MYP.log("doing some work, idx: " + idx + ", maxIdx" + endIdx);
            try {
                doTestRun(idx);
                idx++;
            } catch (err) {
                MYP.warn("error on testrun", err);
            }
        };

        if (pd.timerId) {
            clearInterval(pd.timerId);
            pd.timerId = null;
        }
        pd.timerId = setInterval(func, intervalTime);
    }

    async function doTestRun(idx: number, doLoadMissing: boolean = false) {
        let tg = pd.taskGroup;
        if (!pd.doWork || !tg || idx >= tg.pendingTaks.length) {
            MYP.log("finished work BBB", [pd.doWork, tg, idx, tg]);
            return;
        }

        if (doLoadMissing) {
            for (let i = 0; i < idx; i++) {
                // check if any of the urls before idx is not in cache, if so load that one instead
                let url = JiraUtil.genXmlIssueUrl(tg.pendingTaks[i]);
                let res: IHttpRespSlim | null = await dbStores.cache.httpReq.load(url);
                if (!res) {
                    MYP.warn("loading missing issue instead of idx, i:" + i + ", idx: " + idx + ", url: " + url);
                    HttpUtil.getB(url, true);
                    return;
                }
            }
        }

        let url = JiraUtil.genXmlIssueUrl(tg.pendingTaks[idx]);
        //MYP.log('@@ fake get, url:' + url);
        HttpUtil.getB(url, true);
    }

    function onClickStop() {
        if (pd.timerId) {
            clearInterval(pd.timerId);
            pd.timerId = null;
        }
        if (!pd.doWork) {
            MYP.log("Not working, cant stop.");
            return;
        } else if (!pd.taskGroup) {
            MYP.log("No task selected, cant stop");
            return;
        }
        MYP.log("Stopping work on task: " + pd.taskGroup.name);
        pd.doWork = false;
    }

    function onClickClear() {
        pd.taskGroup = null;
        pd.doWork = false;
        if (pd.timerId) {
            clearInterval(pd.timerId);
            pd.timerId = null;
        }
        MYP.log("onClickClear()");
    }

    async function onClickGatherMissing() {
        // let map = await MYP.jiraHelper.importCachedIssuesA();
        // let issueNames:string[] =  Array.from(map.keys());
        MYP.log("@@@ issueNames: "); //, issueNames);
    }

    async function onClickTestA_OLD() {
        MYP.log("onClickTestA()");
        let idx = 0;
        let maxIdx = 1500;

        let tg = pd.taskGroup;
        if (!tg) {
            MYP.log("no taskgroup selected");
        }
        MYP.log("importing files from httpcache");
        //let text =
        //httpcache/
        let url: string = "/httpcache/__urllist.txt";

        //let resp = await fetch(url);

        let prom = fetch(url).then(async (resp) => {
            if (resp.status == 200) {
                let text = await resp.text();
                //refillCache(text);
            } else {
                MYP.warn("error getting urllist, url: " + url, resp);
            }
        });
    }

    // async function refillCache(urlListText: string) {
    //     let lines = urlListText.split("\n");
    //     let idx = 0;

    //     lines.forEach((line) => {
    //         let parts = line.split(";", 3);
    //         if (line && parts.length != 3) {
    //             MYP.warn("unexpected line in urllist, line: " + line);
    //         }
    //         let name = parts[1].trim();
    //         let urlA = parts[2].trim();
    //         if (idx < 1) {
    //             let urlB = "/httpcache/" + name;
    //             //let resp = await  HttpUtil.getA(urlB);
    //             HttpUtil.getA(urlB).then((resp) => {
    //                 //MYP.log("process line from urllist, name: " + name + ", url: " + urlA, resp.data);
    //                 //dbStores.cache.httpReq.save();
    //             });
    //         } else {
    //             //MYP.log("fake process line from urllist, name: " + name + ", url: " + urlA);
    //         }
    //         idx++;
    //     });
    // }
</script>

<div class="page-block">
    <h5>Gather external data</h5>
    Click on a job to see a summary. Missing data can be gathered by adding it to the queue and pressing gather. NB the page is not fully working. It was not finished due to time constraints.
</div>

<StatusBar />

<div class="page-block" style="padding-bottom: 10px;">
    <div>
        <div style="padding-bottom:10px;">
            <span style="font-weight: bold;">working: </span><span>{pd.doWork ? "yes" : "no"}</span>
        </div>
        <!-- svelte-ignore a11y_invalid_attribute -->
        <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickStart()}>start</a>
        <!-- svelte-ignore a11y_invalid_attribute -->
        <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickStop()}>stop</a>
        <!-- svelte-ignore a11y_invalid_attribute -->
        <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickClear()}>clear</a>

        {#if false}
            <!-- svelte-ignore a11y_invalid_attribute -->
            <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickGatherMissing()}>gather_missing</a>
        {/if}
    </div>
    <br />
    {#if pd.mySheets}
        csv files:
        {#each pd.mySheets as item}
            <div style="margin-left: 20px;">
                <!-- svelte-ignore a11y_invalid_attribute -->
                <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickCsv(item)}>{item.name}</a>
            </div>
        {/each}
    {/if}
</div>

<div class="page-block">
    {#if pd.tableA.showTable}
        <!-- <taskgrouptableA showTable={pd.tableA.showTable} colTitles={pd.tableA.colTitles} rowKeys={pd.tableA.rowKeys} rowObjs={pd.tableA.rowObjs} /> -->
        <br />
    {/if}

    {#if pd.taskGroup}
        <div class="page-block">
            <table class="taskgrouptable">
                <thead><tr><th>Name</th><th>Value</th></tr></thead>
                <tbody>
                    <tr><td>Task</td><td>{pd.taskGroup.name}</td></tr>
                    <tr><td>Status</td><td>-</td></tr>
                    <tr><td>Progress</td><td>{pd.taskGroup.pendingIdx} of {pd.taskGroup.pendingTaks.length}</td></tr>
                    <tr><td>PendingCnt</td><td>{pd.taskGroup.pendingTaks.length}</td></tr>
                    <tr><td>TotalCnt</td><td>{pd.taskGroup.allTasks.length}</td></tr>
                    <tr><td>ErrCnt</td><td>{pd.taskGroup.errCnt}</td></tr>
                    <tr><td>MaxErrCnt</td><td>{pd.taskGroup.maxErrCnt}</td></tr>
                    <tr><td>WorkTokens</td><td>{pd.taskGroup.workTokens}</td></tr>
                </tbody>
            </table>
        </div>
    {/if}
</div>

<style>
    .taskgrouptable thead {
        background-color: #bdd5d7;
        text-align: left;
    }

    .taskgrouptable tbody tr:nth-child(even) {
        background-color: #e6d8d3;
    }

    .taskgrouptable tbody td {
        padding-right: 1em;
        /* max-width: 500px; */

        /* line-break: anywhere; */
    }
</style>
