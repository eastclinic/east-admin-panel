<template>
    {{colData}}
    {{rowData}}
    <DataTable :value="rowData" tableStyle="min-width: 50rem" >

        <Column field="text" header="Услуга" style="min-width: 12rem">
            <template #body="{ data }" >
                {{data.text}}

            </template>
        </Column>
        <Column  v-for="col of colData" :key="col.id" :field="col.text" :header="col.text">
            <template #body="{ data }" >
                {{(bindsData && bindsData[col.id] && bindsData[col.id][data.id]) ? bindsData[col.id][data.id] : '' }}
            </template>
        </Column>
    </DataTable>
</template>

<script lang="ts">
    import  ControlData  from './ControlData'

    export default {
        props: ControlData.props,
        setup(props) {
            return ControlData.setup(props);
        },
    };

</script>


<style scoped>

</style>