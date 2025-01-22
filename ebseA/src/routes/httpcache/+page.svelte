<script lang="ts">
    import GeneralTable from "$lib/components/general/GeneralTableA.svelte";
    import StatusBar from "$lib/components/general/StatusBar.svelte";
    import { MYP } from "$lib/ts/app/MyApp";
    import { dbStores } from "$lib/ts/db/MyDB";
    import type { IHttpRespSlim, StorageWrapB } from "$lib/ts/types/AppTypes";
    import { BlobReader, BlobWriter, HttpReader, TextReader, TextWriter, ZipReader, ZipWriter } from "@zip.js/zip.js";

    function onClickA() {
        MYP.log("onClickA()");
    }

    function onClickB() {
        MYP.log("onClickB()");

    }

    async function onClickZipCache() {
        MYP.log("onClickZipCache(), generating zip...");

        const zipWriter = new ZipWriter(new BlobWriter("application/zip"));
        //let promArr: Promise<any>[] = [];
        let urlArr: string[] = [];
        let itemIdx: number = 1;
        let boxElem = document.querySelector(".downloadbox");
        if (boxElem) {
            boxElem.innerHTML = "";           
        }

        let func = function (wrap: StorageWrapB<IHttpRespSlim>, key: IDBValidKey) {
            let url = "" + key;

            let parts = url.toString().split("/");
            if (parts.length > 0) {
                let name = parts[parts.length - 1];
                urlArr.push("" + itemIdx + "; " + name + "; " + url);
                MYP.log("processing cache item idx: " + itemIdx + ", file: " + name, wrap.dbKey, wrap);
                itemIdx++;
                let prom = zipWriter.add(name, new TextReader(wrap.obj.data));
                return prom;
            } else {
                MYP.warn("unable to get name from url in onClickB, url: " + url, parts);
                return new Promise((resolve, reject) => {
                    reject(null);
                });
            }
        };
        await dbStores.cache.httpReq.iterateStoreEntries(func);

        let text = urlArr.join("\n");
        zipWriter.add("__urllist.txt", new TextReader(text));
        let blob = await zipWriter.close();
        let dlElem = Object.assign(document.createElement("a"), {
            download: "httpcache.zip",
            href: URL.createObjectURL(blob),
            textContent: "Download zip file",
        });
        
        if (boxElem) {
            //boxElem.innerHTML = "";
            boxElem.appendChild(dlElem);
        }

        //document.querySelector(".downloadbox")?.appendChild(elem);
    }

    function bla() {}
</script>

<div class="page-block">
    <h5>testD</h5>
    This is a testpage: testD 123
</div>

<StatusBar />

<div class="page-block">
    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickZipCache()}>generate zip</a>

    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickA()}>clickA</a>

    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickB()}>clickB</a>
</div>
<br />
<div>
    <span>download link: </span> <span class="downloadbox"></span>
</div>
