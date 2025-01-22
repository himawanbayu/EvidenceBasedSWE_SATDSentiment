<script lang="ts">
    import StatusBar from "$lib/components/general/StatusBar.svelte";
    import { MYP } from "$lib/ts/app/MyApp";
    import type { HttpRespType, IHttpRespSlim } from "$lib/ts/types/AppTypes";
    import { HttpUtil } from "$lib/ts/util/HttpUtil";
    import { JiraUtil } from "$lib/ts/util/JiraUtil";
    import { StringUtil } from "$lib/ts/util/StringUtil";
    import axios from "axios";
    import * as cheerio from "cheerio";
    import { XMLParser } from "fast-xml-parser";
    // import parse from "html-dom-parser";

    let contentA = "";
    let contentB = "";
    let contentType = "";
    let procMode = "";
    let curUrl = "";
    //
    let urlA = JiraUtil.genIssuePageUrlA("CAMEL-10009"); //"https://issues.apache.org/jira/browse/CAMEL-10009";
    let urlB = JiraUtil.genIssueXmlUrlA("CAMEL-10009"); // "https://issues.apache.org/jira/si/jira.issueviews:issue-xml/CAMEL-10009/CAMEL-10009.xml";
    //let urlB = JiraUtil.genIssueXmlUrlA("CAMEL-21352"); //  "https://issues.apache.org/jira/si/jira.issueviews:issue-xml/CAMEL-21352/CAMEL-21352.xml";
    let urlC = "https://cdn.jsdelivr.net/npm/jquery@3.7.1/package.json";
    let urlD = "http://google.com";
    //let urlD = "https://raw.githubusercontent.com/jquery/jquery/refs/heads/main/package.json";

    function onClickClear() {
        contentA = "";
        contentB = "";
        contentType = "";
        procMode = "";
        curUrl = "";
        MYP.log("onClickClear()");
    }

    // *** OLD ***
    function processRespUtil(url: string, respSlim: IHttpRespSlim) {
        curUrl = url;
        contentA = respSlim.data;
        let ct: string = ("" + respSlim.headers.contentType).toLowerCase();
        contentType = ct;
        if (ct.includes("/htm")) {
            procMode = "html";
        } else if (ct.includes("/xml")) {
            procMode = "xml";
        } else if (ct.includes("/json")) {
            procMode = "json";
        } else if (ct.includes("/plain")) {
            procMode = "plain";
        } else {
            procMode = "unknown";
        }
    }

    function processRespAxios(url: string, respAx: HttpRespType) {
        curUrl = url;
        contentA = respAx.data;
        //let ct: string = ("" + resp.headers.contentType).toLowerCase();
        let ct = respAx.headers["content-type"] ? "" + respAx.headers["content-type"] : "";
        contentType = ct;
        contentB = "";
        if (ct.includes("/htm")) {
            procMode = "html";
            const jqObj = cheerio.load(contentA);
            jqObj("script").remove();
            jqObj("meta").remove();
            jqObj("link").remove();
            let abc = jqObj.html();
            let strB = abc ? abc : "";
            strB = StringUtil.removeEmptyLines(strB, false, false);
            contentB = strB;
            // } else if (ct.includes("/xml")) {
            //     procMode = "xml";
            //     let parser = new XMLParser();
            //     let xmlObj = parser.parse(contentA);
            //     contentB = JSON.stringify(xmlObj, null, 2);
        } else if (ct.includes("/xml")) {
            procMode = "xml";

            if (JiraUtil.isJiraUrl(url)) {
                let objA = JiraUtil.processIssueXml(url, contentA);
                contentB = JSON.stringify(objA, null, 2);
            } else {
                const jqObj = cheerio.load(contentA);

                let abc = jqObj.xml();
                let strB = abc ? abc : "";
                contentB = strB;
            }
        } else if (ct.includes("/json")) {
            procMode = "json";
            let jsonObj = JSON.parse(contentA);
            contentB = JSON.stringify(jsonObj, null, 2);
        } else if (ct.includes("/plain")) {
            procMode = "plain";
        } else {
            procMode = "unknown";
        }
    }

    function onClickBasic(funcName: string, url: string, useAxios: boolean = true) {
        if (useAxios) {
            onClickBasicAxios(funcName, url);
        } else {
            onClickBasicUtil(funcName, url);
        }
    }

    // use axios directly, so axios can be configured to not auto parse json
    function onClickBasicAxios(funcName: string, url: string) {
        curUrl = url;
        //MYP.log(funcName + ", url:" + url);
        MYP.log("loading url: " + url);
        let func = processRespAxios;

        //const headers = {};
        try {
            axios
                .get(url, {
                    //headers: headers,
                    transformResponse: (x) => x, // this will disable automatic json parsing by axios, see: https://stackoverflow.com/a/71907866
                })
                .then((resp) => {
                    //MYP.log("zzz resp", resp);
                    MYP.log("finished loading url: " + url, resp);
                    func(url, resp);
                })
                .catch((ex) => {
                    MYP.log("ErrorA during loading of url: " + url, ex);
                });
        } catch (ex) {
            MYP.log("ErrorB during loading of url: " + url, ex);
        }
    }

    function onClickBasicUtil(funcName: string, url: string) {
        curUrl = url;

        MYP.log(funcName + ", url:" + url);
        let func = processRespUtil;
        HttpUtil.getB(url, false).then((resp) => {
            //MYP.log("zzz resp", resp);
            //contentA = resp.data;
            func(url, resp);
        });
    }

    function onClickA() {
        onClickBasic("onClickA", urlA);
    }

    function onClickB() {
        onClickBasic("onClickB", urlB);
    }

    function onClickC() {
        onClickBasic("onClickC", urlC);
    }

    function onClickD() {
        onClickBasic("onClickD", urlD);
    }

    /****************** [OLD CODE] ******************/

    /*
    function cleanString(str: string): string {
        //return str.replaceAll("\r", "\n").replaceAll(/(\n+)/g, "\n"); //.replaceAll(/([ \t]+)/g, " ");
        return str
            .replaceAll("\r", "\n")
            .replaceAll(/([\t ]+\n)/g, "\n")
            .replaceAll(/(\n+)/g, "\n");
        //.replaceAll(/([ \t]+)/g, " ");
    }


    function onClickA_OLD() {
        let url = urlA;
        curUrl = url;

        MYP.log("onClickA, url: " + url);

        // HttpUtil.getA(urlB).then((resp)=>{
        //     MYP.log('zzz resp', resp);
        //     content = resp.data;
        // });

        const headers = {
            "Cache-Control": "no-cache",
            "Content-Type": "application/x-www-form-urlencoded",
            //"Content-Type": "text/plain",
            //"Access-Control-Allow-Origin": "http://localhost:7000",
            //"Access-Control-Allow-Origin": "*",
            //"Access-Control-Allow-Credentials": true,
            //"Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD, OPTIONS, PATCH, PROPFIND, PROPPATCH, MKCOL, COPY, MOVE, LOCK",
            //"Access-Control-Allow-Methods": "GET, POST",
            //"Access-Control-Allow-Credentials":true,
            //"Access-Control-Expose-Headers":"*",
        };

        axios
            .get(url, {
                //headers: headers,
            })
            .then((resp) => {
                MYP.log("zzz resp", resp);
                contentA = resp.data;
            });
    }

    */
</script>

<div class="page-block" style="max-width: 40em;">
    <h5>test cors</h5>
    <div>
        Test page for CORS. Press on of the three buttons to load an external resource into the textarea. <br />
        In case the urls fail to load, look at console.log to see the complete error messages. If the issue is related to a <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS" target="_blank">CORS</a> issue, browser extensions can be found
        i.e. in the chromewebstore, to prevent this, extensions like 'CORS Unblock'.
    </div>
</div>

<StatusBar />

<div class="page-block">
    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickA()}>urlA</a>

    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickB()}>urlB</a>

    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickC()}>urlC</a>

    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickD()}>urlD</a>

    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickClear()}>clear</a>
</div>
<br />

<div>
    <div><span style="font-weight: bold;">url: </span><span>{curUrl}</span></div>
    <div><span style="font-weight: bold;">content-type: </span><span>{contentType}</span></div>
    <div><span style="font-weight: bold;">mode: </span><span>{procMode}</span></div>
</div>
<br />

{#if contentA}
    <span><span style="font-weight: bold;">contentA</span> (raw content): </span>
    <div>
        <textarea cols="140" readonly style="height: 300px;">{contentA}</textarea>
    </div>
    <br />
{/if}

{#if contentB}
    <span><span style="font-weight: bold;">contentB</span> (processed content):</span>
    <div>
        <textarea cols="140" readonly style="height: 300px;">{contentB}</textarea>
    </div>
{/if}
