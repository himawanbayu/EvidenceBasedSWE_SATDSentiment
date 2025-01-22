<script lang="ts">
    import StatusBar from "$lib/components/general/StatusBar.svelte";
    import TestBox from "$lib/components/general/TestBox.svelte";
    import { MYP } from "$lib/ts/app/MyApp";

    function onClickA() {
        MYP.log('onClickA');
    }

    function onClickB() {
        MYP.log('onClickB');
    }
</script>

<div class="page-block">
    <h5>testB</h5>
    This is a testpage: testB 123
</div>

<StatusBar />

<div class="page-block">
    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickA()}>clickA</a>

    <!-- svelte-ignore a11y_invalid_attribute -->
    <a href="javascript:void(0);" class="txt-btn-med" onclick={(e) => onClickB()}>clickB</a>
</div>

<TestBox abc="aabbcc"/>