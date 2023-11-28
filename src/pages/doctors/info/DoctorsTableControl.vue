<script setup>

import EditDialog from "./EditDialog.vue";

import { FilterMatchMode, FilterOperator } from 'primevue/api';
import doctorsService from "@/services/Doctors/DoctorsInfoService";
import dataTableRequestAdapter from "@/api/apiRequestAdapters/DataTableRequestAdapter";

import { ref, reactive, onBeforeMount, computed } from 'vue';
const filters1 = ref(null);
const visibleEditDialog = ref(false);
const editData = ref({});

const doctors = computed(() => doctorsService.items());
// // const count = doctorsService.count();
// const countRows = computed(() => doctorsService.count());

const count = computed(() => doctorsService.count());
const countRows = 10;


onBeforeMount(async () => {
    initFilters1();
    await doctorsService.fetchServerData();
});





const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
    };
};

const clearFilter1 = () => {
    initFilters1();
};

const onPage = async (e) =>{
    await doctorsService.fetchServerData(dataTableRequestAdapter.page(e.page+1));
}

const onOpenEdit = async (e) =>{
    visibleEditDialog.value = true;
    editData.value = e.data;
}


const refreshItem = async (id) =>{
    await doctorsService.refreshItem( id );
}


</script>

<template>
<EditDialog v-model:visible="visibleEditDialog" :editData="editData" @updated="refreshItem"></EditDialog>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <DataTable
                    :value="doctors"
                    :paginator="true"
                    class="p-datatable-gridlines"
                    :rows="countRows"
                    :lazy="true"
                    dataKey="id"
                    :rowHover="true"
                    filterDisplay="menu"
                    responsiveLayout="scroll"
                    @page="onPage"
                    :totalRecords="count"
                    editMode="row"
                    @row-edit-init="onOpenEdit"
                >
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <Button type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2" @click="clearFilter1()" />
                            <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search" />
                                <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%" />
                            </span>
                        </div>
                    </template>
                    <template #empty> No customers found. </template>
                    <template #loading> Loading customers data. Please wait. </template>

                    <Column field="author" header="Автор" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.fullname
                            }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
                        </template>
                    </Column>

                    <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
                </DataTable>
            </div>
        </div>

    </div>
</template>

<style scoped lang="scss">
@import '@/assets/demo/styles/badges.scss';

::v-deep(.p-datatable-frozen-tbody) {
    font-weight: bold;
}

::v-deep(.p-datatable-scrollable .p-frozen-column) {
    font-weight: bold;
}
::v-deep(.editable-cells-table td.p-cell-editing) {
    padding-top: 0.6rem;
    padding-bottom: 0.6rem;
}
</style>
