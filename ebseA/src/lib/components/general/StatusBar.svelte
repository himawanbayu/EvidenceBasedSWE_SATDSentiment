<script lang="ts">
    import { MYP } from "$lib/ts/app/MyApp";

    //let lstMsg = $props();
    //console.log('aazz####');
</script>

<div class="page-block duo-col-grid">
    <col1 class="tooltip" data-tooltip="See console.log for all messages.">Result last action*:</col1>
    <col2><input type="text" disabled bind:value={MYP.volState.lastMsg} /> </col2>
</div>
