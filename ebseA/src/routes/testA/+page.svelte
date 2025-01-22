<script lang="ts">
    import { MYP } from "$lib/ts/app/MyApp";
    import { HttpUtil } from "$lib/ts/util/HttpUtil";
    import axios from "axios";

    let content = "{empty}";

    function onClickA() {
        MYP.log("onClickA");
        
    }

    function onClickB() {
        MYP.log("onClickB", { aaa: 1, bbb: "zz-241" });
    }
</script>

<h5>testA</h5>
This is a testpage: testA 123

<div>
    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickA()}>clickA</a>

    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickB()}>clickB</a>
</div>
<br />

content:
<div>
    <textarea cols="140" readonly style="height: 300px;">{content}</textarea>
</div>
