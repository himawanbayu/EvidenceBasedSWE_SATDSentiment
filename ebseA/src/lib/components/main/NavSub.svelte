<script lang="ts">
    import type { INavItem } from "$lib/ts/types/AppTypes";
    import { page } from "$app/stores";

    let curPath: string;
    $: curPath = $page.url.pathname;

    export let link: INavItem = {
        name: "Some Page",
        url: "/someurl",
        subs: new Array<INavItem>(),
    };
</script>
 
{#if link}
    <ul class="nav">
        <li class="nav-item {curPath === link.url ? 'active' : ''}">
            <a href={link.url} style={link.url ? "" : "pointer-events: none;"}  >{link.name}</a>
            <!-- without url, disable the anchor by setting pointer-events to none -->
            {#each link.subs as sub}
                <svelte:self link={sub} />
            {/each}
        </li>
    </ul>
{/if}

<style>
    

</style>