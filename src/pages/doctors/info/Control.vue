<script setup>
import {contextPath, reviews, customer1, filters1, loading1, statuses, representatives,
    customerService, initFilters1, clearFilter1, formatDate, onBeforeMountHook, onBeforeMountInitFilters,
    onPage, count, countRows,
    onOpenEdit, visibleEditDialog, editData,
    updateReview
} from './ControlData'

import {  onBeforeMount } from 'vue';
import EditDialog from "./EditDialog.vue";

onBeforeMount(onBeforeMountHook());


onBeforeMount(onBeforeMountInitFilters());


</script>

<template>
<EditDialog v-model:visible="visibleEditDialog" :editData="editData" @update:review="updateReview"></EditDialog>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <DataTable
                    :value="reviews"
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
                            {{ data.author }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
                        </template>
                    </Column>
                    <Column field="author" header="Рейтинг" style="min-width: 12rem">
                        <template #body="{ data }">
                            <Rating v-model="data.rating" readonly :cancel="false" />
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by rating" />

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
