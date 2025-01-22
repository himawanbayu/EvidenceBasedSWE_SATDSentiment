<script lang="ts">
    let {
        showTable = true,
        //colTitles = $bindable(["Name", "Value"]),
        colTitles = ["Name", "Value"],
        rowKeys = ["valA", "valB"],
        rowObjs = [
            { valA: "name", valB: "John Smith" },
            { valA: "length (cm)", valB: 120 },
        ],
    } = $props();
</script>

{#if showTable}
    <div class="generaltablebox">
        <table class="generaltable">
            <thead>
                <tr>
                    {#each colTitles as ct}
                        <th>{ct}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each rowObjs as row}
                    <tr style="max-width: 350px;">
                        {#each rowKeys as rk}
                            <td>{row[rk]}</td>
                        {/each}
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/if}

<style>
    .generaltablebox {
        max-width: 1100px;
    }

    .generaltable {
        padding-bottom: 15px;
        /* table-layout:fixed;
        width:100%; */
    }

    .generaltable thead {
        background-color: #bdd5d7;
        text-align: left;
    }

    .generaltable tbody tr:nth-child(even) {
        background-color: #e6d8d3;
    }

    .generaltable tbody td {
        padding-right: 1em;
        /* max-width: 500px; */
        
        /* line-break: anywhere; */
    }
</style>
