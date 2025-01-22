<script lang="ts">
    import type { INavItem } from "$lib/ts/types/AppTypes";

    import NavSub from "$lib/components/main/NavSub.svelte";

    // BOOKMARK NAV

    const linkArr: INavItem[] = [
        { name: "Home", url: "/", subs: [] },                
        { name: "Csv data", url: "/csvdata", subs: [] },
        { name: "Gather data", url: "/gatherdata", subs: [] },
        { name: "Http cache", url: "/httpcache", subs: [] },                
        { name: "----", url: "", subs: []},
        { name: "testcors", url: "/testcors", subs: [] },    
        { name: "testA", url: "/testA", subs: [] },    
        { name: "testB", url: "/testB", subs: [] },    
        { name: "testC", url: "/testC", subs: [] },    
        
        { name: "----", url: "", subs: []},
        // { name: "Data", url: "", subs: [
        //     {name: "setA", url:"/data/setA", subs:[]},
        //     {name: "setB", url:"/data/setB", subs:[]},
        //     {name: "setC", url:"/data/setC", subs:[]},
        //     {name: "setD", url:"/data/setD", subs:[]},
        // ]},
        //{ name: "Not Found", url: "/notfound", subs: [] },
    ];
  
 
</script>

{#each linkArr as link}
    <NavSub {link} />
{/each}

<!-- 
<ul class="nav">
    <li class="nav-item">
        <a href="/">Home</a>
    </li>
    <li class="nav-item">
        <a href="/testA">testA</a>
    </li>
    <li class="nav-item">
        <a href="/testB">testB</a>
        <ul class="nav">
            <li class="nav-item">
                <a href="/testB/sub1">sub1</a>
            </li>
        </ul>
    </li>
</ul> 
-->

<!-- example below from: https://picturepan2.github.io/spectre/components/nav.html#nav
<ul class="nav">
    <li class="nav-item">
        <a href="#">Elements</a>
    </li>
    <li class="nav-item active">
        <a href="#">Layout</a>
        <ul class="nav">
            <li class="nav-item">
                <a href="#">Flexbox grid</a>
            </li>
            <li class="nav-item">
                <a href="#">Responsive</a>
            </li>
            <li class="nav-item">
                <a href="#">Navbar</a>
            </li>
            <li class="nav-item">
                <a href="#">Empty states</a>
            </li>
        </ul>
    </li>
    <li class="nav-item">
        <a href="#">Components</a>
    </li>
    <li class="nav-item">
        <a href="#">Utilities</a>
    </li>
</ul> 
-->
