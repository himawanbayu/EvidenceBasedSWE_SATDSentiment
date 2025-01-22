<script lang="ts">
    import GeneralTableA from "$lib/components/general/GeneralTableA.svelte";
    import StatusBar from "$lib/components/general/StatusBar.svelte";
    import { MYP } from "$lib/ts/app/MyApp";
    import { SheetUtil } from "$lib/ts/util/SheetUtil";
    import { WinkUtil } from "$lib/ts/util/WinkUtil";
    import { pipeline } from "@huggingface/transformers";

    function onClickA() {
        let rowObjs = [
            { a: "Abc", b: "zzz" },
            { a: 123, b: "dit is een \ntest\"'kjeuz" },
        ];
        let res = SheetUtil.genCsv(rowObjs);
        MYP.log("onClickA: ", res);
    }

    function onClickB() {
        MYP.log("onClickB");
        //let text = "the house is red";
        let lines = ["Covid cases are increasing fast!", "The house is red", "What a lovely day!"];

        lines.forEach((line) => {
            let text = line;
            MYP.log(text + ", senti: " + WinkUtil.determineSentiment(text)); //, HuggingFaceU);
        });
        //let text = "This line of code has an error :(. And now i am making the sentence very very long by using many words to see how the sentiment score will change after adding all these words.";
        //MYP.log(text + ", senti: " + WinkUtil.determineSentiment(text));
    }

    async function onClickC() {
        //const out = await pipe("I love transformers!");
        let lines = ["Covid cases are increasing fast!", "The house is red", "What a lovely day!"];
        //let out = await pipe("I love transformers!");
        //MYP.log("HuggingFace: " + JSON.stringify(out), out); //, HuggingFaceU);

        lines.forEach(async (line) => {
            let text = line;
            let pipe = await pipeline("sentiment-analysis");
            let out = await pipe(line);
            
            MYP.log("Hug, text: " + text + ", senti: " + JSON.stringify(out), out); //, HuggingFaceU);
         });
    }
</script>

<div class="page-block">
    <h5>testC</h5>
    This is a testpage: testC 123
</div>

<StatusBar />

<div class="page-block">
    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickA()}>clickA</a>

    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickB()}>clickB</a>

    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickC()}>clickC</a>
</div>

<div class="page-block">
    <GeneralTableA />
</div>
