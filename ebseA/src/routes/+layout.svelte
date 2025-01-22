<script lang="ts">
    import Nav from "$lib/components/main/Nav.svelte";
    import { MYP } from "$lib/ts/app/MyApp";
    import { onMount } from "svelte";

    MYP.noop(); // useless call to make sure the import of MYP is not marked as unused
    //MYP.debug("layout.svelte ");
    onMount(() => {
        //MYP.debug("layout.svelte onMount()");
    });
</script>

<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/spectre.css@0.5.9/dist/spectre.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/spectre.css@0.5.9/dist/spectre-exp.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/spectre.css@0.5.9/dist/spectre-icons.css" />
    <link rel="stylesheet" href="/css/global.css" />
</svelte:head>

<div class="myApp">
    <nav>
        <h5>ebseA</h5>
        <Nav />
    </nav>
    <main>
        <slot />
    </main>
</div>

<style>
    /* for debugging */
    /*
    .myApp > * {
        border: 1px darkgray dotted;
    }*/

    /**********************************/
    /******* [grid stuff below] *******/
    /**********************************/

    /* from: https://itnext.io/simple-web-layout-with-css-grid-ec6be5086531 */

    nav > h5 {
        text-align: center;
    }

    .myApp {
        display: grid;
        /* grid-template-rows: 1fr 5fr 1fr; */
        grid-template-columns: minmax(min-content, 0.65fr) 5fr;
        grid-template-areas: "nav main";
        grid-gap: 0em; /*.75em*/
        min-height: 100vh;
    }

    /* grid areas */
    nav {
        grid-area: nav;
    }

    main {
        grid-area: main;
    }

    /* border */
    /* nav {
        border-right: 1px solid #bcc3ce;
    } */

    /* grid colors */
    nav {
        background-color: #f7f8f9;
    }

    main {
        background-color: #fff;
    }

    /* add grid padding */
    main {
        padding: 5px 0px 0px 5px;
    }
</style>
