<script lang="ts">
    import GeneralTableA from "$lib/components/general/GeneralTableA.svelte";
    import StatusBar from "$lib/components/general/StatusBar.svelte";
    import { AppCfg } from "$lib/ts/app/AppCfg";
    import { MYP } from "$lib/ts/app/MyApp";
    import { SheetItem } from "$lib/ts/structs/SheetItem";
    import { TableDataA } from "$lib/ts/structs/TableDataA.svelte";

    import { SheetType, type IJiraIssue, type ISheetData, type ISheetRow } from "$lib/ts/types/AppTypes";
    import { SheetUtil } from "$lib/ts/util/SheetUtil";
    import { WinkUtil } from "$lib/ts/util/WinkUtil";
    import { WuzzyUtil } from "$lib/ts/util/WuzzyUtil";
    import { BlobWriter, TextReader, ZipWriter } from "@zip.js/zip.js";

    interface IPageDataCsv {
        mySheets: SheetItem[];
        tableA: TableDataA;
        tableB: TableDataA;
        curSheetItem: SheetItem | null;
        curSheetData: ISheetData | null;
    }

    let pd: IPageDataCsv = {
        // pd: pageData
        mySheets: AppCfg.MY_SHEETS,
        tableA: new TableDataA(),
        tableB: new TableDataA(),
        curSheetItem: null,
        curSheetData: null,
        //curSheetData
    };

    async function onImportCachedIssues() {
        MYP.log("importing cached jira issues...");
        await MYP.jiraHelper.importCachedIssuesA();
        MYP.log("imported cached jira issues, nr of issues in map: " + MYP.jiraHelper.issueMap.size);
    }

    function onClickClear() {
        pd.tableA.clear(); // = TableDataD.exampleA();
        pd.tableB.clear(); // = TableDataD.exampleA();
        pd.curSheetItem = null;
        pd.curSheetData = null;
        MYP.log("onClickClear()"); //, pd.tableA, pd.tableB);
    }

    function genSummaryRows(sheetItem: SheetItem, sheetData: ISheetData): ISheetRow[] {
        let arr: ISheetRow[] = [
            { key: "fields", val: sheetData.keys },
            { key: "rowCnt", val: sheetData.rows.length },
            { key: "errors", val: JSON.stringify(sheetData.parseErrors, null, 2) },
        ];

        if (sheetItem.type != SheetType.Unknown) {
            let projMap: Map<string, number> = SheetUtil.countUniqueColValues(sheetData, "project");
            let projNames = Array.from(projMap.keys());
            arr.push({ key: "projectCnt", val: projNames.length });
            arr.push({ key: "projects", val: "[" + projNames.join(",") + "]" });
            arr.push({ key: "projectMap", val: JSON.stringify(Object.fromEntries(projMap)) });
        }

        return arr;
    }

    function getDelta(start: string, end: string) {
        let delta = 0;
        try {
            delta = new Date(end).getTime() - new Date(start).getTime();
        } catch (error) {
            delta = 0;
        }
        return delta;
    }

    function expandIssueSheet(sheetItem: SheetItem, sheetData: ISheetData) {
        let ka = "project";
        let kb = "issue_number";
        let kc = "comment_";

        if (!sheetData.keys.includes(ka) || !sheetData.keys.includes(kb)) {
            MYP.warn("sheetData did not contain required fields, ka: " + ka + ", kb: " + kb + ", keys: [" + sheetData.keys.join(",") + "]");
            return;
        }
        //boolean

        let didExpand = false;
        sheetData.rows.forEach((row) => {
            //project	issue_number	issue_type	text	classification	indicator
            let name = (row[ka] + "-" + row[kb]).toUpperCase();
            let issue: IJiraIssue | undefined = MYP.jiraHelper.issueMap.get(name);
            //MYP.debug('@#@# name: ' + name, issue, MYP.jiraHelper.issueMap);
            if (issue) {
                didExpand = true;
            }

            let isDescRow = issue && row["issue_type"] == "description";
            let isSumRow = issue && row["issue_type"] == "summary";
            let isComRow = issue && ("" + row["issue_type"]).includes(kc);

            let comIdx = 0;
            if (isComRow) {
                let parts = ("" + row["issue_type"]).split(kc);
                comIdx = parts.length > 0 ? Number(parts[1]) : 0;
            }

            //let isFirstComRow = issue &&  row["issue_type"] == "comment_0";

            let zzTextVal = "";
            if (isDescRow) {
                zzTextVal = issue ? issue.description : "";
            } else if (isSumRow) {
                zzTextVal = issue ? issue.summary : "";
            } else if (isComRow && issue && issue.comments[comIdx]) {
                //} else if (isComRow && issue) {
                zzTextVal = issue.comments[comIdx].text;
                //MYP.log("@@@ isComRow comIdx: " + comIdx, issue.comments);
            }

            let orgText = row["text"] ? "" + row["text"] : "";
            let zzWinkA = orgText ? "" + WinkUtil.determineSentiment(orgText) : "";
            let zzWinkB = zzTextVal ? "" + WinkUtil.determineSentiment(zzTextVal) : "";

            // inspired by: https://stackoverflow.com/a/13894670
            // (endDate.getTime() - startDate.getTime()) / 1000;
            let delta: number = issue && issue.created && issue.resolved ? getDelta(issue.created, issue.resolved) / 1000 : 0;
            let zzDeltaVal = delta > 0 ? "" + delta /*+ "s"*/ : "";
            let zzJaroWink = WuzzyUtil.calcStrDistJaroWink(orgText, zzTextVal);

            row["zz_created"] = issue ? issue.created : "";
            row["zz_updated"] = issue ? issue.updated : "";
            row["zz_resolved"] = issue ? issue.resolved : "";
            row["zz_duration"] = zzDeltaVal;
            row["zz_text"] = zzTextVal;
            row["zz_wink_a"] = zzWinkA;
            row["zz_wink_b"] = zzWinkB;
            row["zz_jaro_wink"] = zzJaroWink; 
            //row["zz_comments_json"] = issue ? JSON.stringify(issue.comments ): '' ; 
            //row["zz_description"] = issue && isDescRow ? issue.description : "";
            //row["zz_summary"] = issue && isSumRow ? issue.summary : "";

            //row["zz_comments"] = issue && isSumRow ? JSON.stringify(issue.comments) : ""; 
        });

        if (didExpand) {
            sheetData.keys.push("zz_created", "zz_updated", "zz_resolved", "zz_duration", "zz_text", "zz_wink_a", "zz_wink_b", "zz_jaro_wink" /*, "zz_comments_json"*/); //  "zz_description", "zz_summary" , "zz_comments"
        }
        //let name = sheetData['proj']
    }

    function onLoadSheetData(sheetItem: SheetItem, sheetData: ISheetData) {
        let rows: ISheetRow[] = genSummaryRows(sheetItem, sheetData);
        pd.tableA.setAll(true, ["Name", "Value"], ["key", "val"], rows);
        pd.tableB.setAll(true, sheetData.keys, sheetData.keys, sheetData.rows.slice(0, 100));

        pd.curSheetItem = sheetItem;
        pd.curSheetData = sheetData;
        //MYP.debug('Done generating tables' , sheetItem, sheetData);
    }

    async function onClickCsv(sheetItem: SheetItem) {
        onClickClear();
        let sd = await MYP.sheetHelper.getSheetData(sheetItem.url);
        //sd.rows = sd.rows.slice(0,100) ; // <==============================================================================================================
        if (sheetItem.type == SheetType.Issue && MYP.jiraHelper.issueMap.size > 0) {
            expandIssueSheet(sheetItem, sd);
        } else {
        }
        onLoadSheetData(sheetItem, sd);
    }

    async function onClickGenCsv() {
        if (!pd.curSheetData || !pd.curSheetItem) {
            MYP.log("no sheetdata selected, select sheet to generate csv");
            return;
        }
        let boxElem = document.querySelector(".downloadbox");
        if (!boxElem) {
            MYP.warn("cant find boxElem");
            return;
        }

        MYP.log("generating zip...");

        boxElem.innerHTML = ""; // clear previous download link

        let res = SheetUtil.genCsv(pd.curSheetData.rows);

        const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
        await zipWriter.add("" + pd.curSheetItem.name + ".csv", new TextReader("" + res));
        let blob = await zipWriter.close();

        let dlElem = Object.assign(document.createElement("a"), {
            download: "sheet-data.zip",
            href: URL.createObjectURL(blob),
            textContent: "Download zip file",
        });

        if (boxElem) {
            //boxElem.innerHTML = "";
            boxElem.appendChild(dlElem);
        }
        MYP.log("finished generating zip");
    }

    // function onClickCsvOLD(sheetItem: SheetItem) {
    //     let prom = MYP.sheetHelper.getSheetData(sheetItem.url);
    //     prom.then((sd: ISheetData) => {
    //         //sd.rows = sd.rows.slice(0,100) ; // <==============================================================================================================
    //         if (sheetItem.type == SheetType.Issue && MYP.jiraHelper.issueMap.size > 0) {
    //             expandIssueSheet(sheetItem, sd);
    //             //MYP.debug('@@## YES expandIssueSheet()', sheetItem, sd);
    //         } else {
    //             //MYP.debug('@@## NO expandIssueSheet()' , sheetItem, sd);
    //         }
    //         onLoadSheetData(sheetItem, sd);
    //     });
    // }
</script>

<div class="page-block">
    <h5>Csv data</h5>
    Select a file to process:
</div>

<StatusBar />

<div class="page-block" style="padding-bottom: 10px;">
    <div>
        <!-- svelte-ignore a11y_invalid_attribute -->
        <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickClear()}>clear</a>

        <!-- svelte-ignore a11y_invalid_attribute -->
        <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onImportCachedIssues()}>import_cached_issues</a>

        <!-- svelte-ignore a11y_invalid_attribute -->
        <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickGenCsv()}>gen_csv</a>
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
        <br />
    {/if}

    <div>
        <span>download link: </span>
        {#if pd.curSheetItem && pd.curSheetData}
            <span class="downloadbox"></span>
        {/if}
    </div>
</div>

<div class="page-block">
    {#if pd.tableA.showTable}
        <GeneralTableA showTable={pd.tableA.showTable} colTitles={pd.tableA.colTitles} rowKeys={pd.tableA.rowKeys} rowObjs={pd.tableA.rowObjs} />
        <br />
    {/if}
    {#if pd.tableB.showTable}
        <GeneralTableA showTable={pd.tableB.showTable} colTitles={pd.tableB.colTitles} rowKeys={pd.tableB.rowKeys} rowObjs={pd.tableB.rowObjs} />
    {/if}
</div>

<style>
</style>
