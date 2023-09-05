<script setup>
import {contextPath, reviews, customer1, filters1, loading1, statuses, representatives,
    customerService, initFilters1, clearFilter1, formatDate, onBeforeMountHook, onBeforeMountInitFilters,
    onPage, count, countRows,filters,
    onOpenEdit, visibleEditDialog, editData, createItem,
    refreshReviewRow, refreshReviews, onSort, rating5,
    onFilter
} from './ReviewsControlData'

import {  onBeforeMount } from 'vue';
import EditDialog from "./EditDialog.vue";

onBeforeMount(onBeforeMountHook());


onBeforeMount(onBeforeMountInitFilters());


</script>

<template>

<EditDialog v-model:visible="visibleEditDialog" :editData="editData" @updated:review="refreshReviewRow" @created:review="refreshReviews"></EditDialog>
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
                    responsiveLayout="scroll"
                    @page="onPage"
                    @sort="onSort"
                    @filter="onFilter"
                    :totalRecords="count"
                    editMode="row"
                    @row-edit-init="onOpenEdit"
                    sortMode="multiple"
                    removableSort
                    :filters="filters1"
                    v-model:filters="filters1"
                    filterDisplay="row"
                    :globalFilterFields="['author', 'rating', 'published']"
                >
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">

                            <Button type="button" icon="pi pi-plus" label="New" class="p-button-outlined mb-2" @click="createItem" />
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

                        <template #body="{ data }" >
                            <Badge v-if="data.is_new"/>
                            {{ data.author }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
                        </template>
                    </Column>
                    <Column field="rating" header="Рейтинг" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{data.rating}}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by rating" />

                        </template>
                    </Column>
                    <Column field="published" header="Verified" dataType="boolean" style="min-width: 6rem">
                        <template #body="{ data }">
                            <i class="pi" :class="{ 'pi-check-circle text-green-500': data.published, 'pi-times-circle text-red-400': !data.published }"></i>
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <TriStateCheckbox v-model="filterModel.value" @change="filterCallback()" />
                        </template>
                    </Column>
                    <Column field="published" header="Published" dataType="boolean" style="min-width: 6rem"    sortable>
                        <template #body="{ data }">
                            <i class="pi" :class="{ 'pi-check-circle text-green-500': data.published, 'pi-times-circle text-red-400': !data.published }"></i>

                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <TriStateCheckbox v-model="filterModel.value" @change="filterCallback()" />
                        </template>
                    </Column>
                    <Column header="Date" filterField="created_at" dataType="date" style="min-width: 10rem" field="created_at" sortable>
                        <template #body="{ data }">
                            {{ formatDate(data.created_at) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />
                        </template>
                    </Column>
                    <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
                </DataTable>
            </div>
        </div>


        <div class="col-12">
            <div class="card">

                <DataTable
                        :value="customer1"
                        :paginator="true"
                        class="p-datatable-gridlines"
                        :rows="10"
                        dataKey="id"
                        :rowHover="true"
                        v-model:filters="filters1"
                        filterDisplay="row"
                        :loading="loading1"
                        :filters="filters1"
                        responsiveLayout="scroll"
                        :globalFilterFields="['name', 'country.name', 'representative.name', 'balance', 'status']"
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

                    <Column field="verified" header="Verified" dataType="boolean" bodyClass="text-center" style="min-width: 8rem">
                        <template #body="{ data }">
                            <i class="pi" :class="{ 'text-green-500 pi-check-circle': data.verified, 'text-pink-500 pi-times-circle': !data.verified }"></i>
                        </template>
                        <template #filter="{ filterModel }">
                            <TriStateCheckbox v-model="filterModel.value" />
                        </template>
                    </Column>
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
