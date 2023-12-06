<script setup>

import EditDialog from "./EditDialog/EditDialog.vue";

import { FilterMatchMode, FilterOperator } from 'primevue/api';
import doctorsService from "@/services/Doctors/DoctorsInfoService";
import DataTableRequestAdapter from "@/api/apiRequestAdapters/DataTableRequestAdapter";

import { ref, reactive, onBeforeMount, computed, watch } from 'vue';
const filters = reactive({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});
const visibleEditDialog = ref(false);
const editData = ref({});

const doctors = computed(() => doctorsService.items());
// // const count = doctorsService.count();
// const countRows = computed(() => doctorsService.count());

const count = computed(() => doctorsService.count());
const countRows = 10;

let requestAdapter = new DataTableRequestAdapter();

onBeforeMount(async () => {
    await loadDoctors();
});

const loadDoctors = async (requestAdapter) => {
    return await doctorsService.fetchServerData(requestAdapter);
}



const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };
};

const onFilter = async (event) => {
    // lazyParams.value.filters = filters.value ;
    // loadLazyData(event);
    return await loadDoctors(requestAdapter.dtEvent(event));
};


watch(filters, async (newQuestion, oldQuestion) => {
    await loadDoctors(requestAdapter.withFiltration(filters));

})

const clearFilter1 = () => {
    initFilters();
};

const onPage = async (e) =>{
    await doctorsService.fetchServerData(requestAdapter.page(e.page+1));
}

const onOpenEdit = async (e) =>{
    visibleEditDialog.value = true;
    editData.value = e.data;
}


const refreshItem = async (id) =>{
    await doctorsService.refreshItem( id );
    if(editData.value.id  &&  editData.value.id === id){
        editData.value = doctorsService.item(id);
    }
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
                    responsiveLayout="scroll"
                    @page="onPage"
                    :totalRecords="count"
                    editMode="row"
                    @row-edit-init="onOpenEdit"
                    @update:filters="onFilter($event)"
                    filterDisplay="row"
                >
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">

                            <Button type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2" @click="clearFilter1()" />
                            <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search" />
                                <InputText v-model="filters['global'].value" placeholder="Keyword Search" style="width: 100%" />
                            </span>
                        </div>
                    </template>
                    <template #empty> No customers found. </template>
                    <template #loading> Загрузка докторов. Пожалуйста подождите. </template>

                    <Column field="id" header="id"/>

                    <Column field="fullname" header="Доктор" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{data.fullname}}
                        </template>
<!--                        <template #filter="{ filterModel }">-->
<!--                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />-->
<!--                        </template>-->
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
