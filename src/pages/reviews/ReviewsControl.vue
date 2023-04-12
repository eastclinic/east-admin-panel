<script setup>
import {contextPath, reviews, customer1, filters1, loading1, statuses, representatives,
    customerService, initFilters1, clearFilter1, formatDate, onBeforeMountHook, onBeforeMountInitFilters,
    onPage, count, countRows,
    onOpenEdit, visibleEditDialog, editData,
    updateReview, editingRow
} from './ReviewsControlData'

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
                    <Column field="published" header="Published" dataType="boolean" style="min-width: 6rem">
                        <template #body="{ data }">
                            <InputSwitch id="my-input-switch" v-model="data.published" />
                        </template>
                        <template #filter="{ filterModel, filterCallback }">
                            <TriStateCheckbox v-model="filterModel.value" @change="filterCallback()" />
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
                        filterDisplay="menu"
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
                    <Column field="author" header="Автор" style="min-width: 12rem">
                        <template #body="{ data }">
                            {{ data.author }}
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by name" />
                        </template>
                    </Column>
                    <Column header="Country" filterField="country.name" style="min-width: 12rem">
                        <template #body="{ data }">
                            <img src="/demo/images/flag/flag_placeholder.png" :alt="data.country.name" :class="'flag flag-' + data.country.code" width="30" />
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ data.country.name }}</span>
                        </template>
                        <template #filter="{ filterModel }">
                            <InputText type="text" v-model="filterModel.value" class="p-column-filter" placeholder="Search by country" />
                        </template>
                        <template #filterclear="{ filterCallback }">
                            <Button type="button" icon="pi pi-times" @click="filterCallback()" class="p-button-secondary"></Button>
                        </template>
                        <template #filterapply="{ filterCallback }">
                            <Button type="button" icon="pi pi-check" @click="filterCallback()" class="p-button-success"></Button>
                        </template>
                    </Column>
                    <Column header="Agent" filterField="representative" :showFilterMatchModes="false" :filterMenuStyle="{ width: '14rem' }" style="min-width: 14rem">
                        <template #body="{ data }">
                            <img :alt="data.representative.name" :src="contextPath + 'demo/images/avatar/' + data.representative.image" width="32" style="vertical-align: middle" />
                            <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ data.representative.name }}</span>
                        </template>
                        <template #filter="{ filterModel }">
                            <div class="mb-3 text-bold">Agent Picker</div>
                            <MultiSelect v-model="filterModel.value" :options="representatives" optionLabel="name" placeholder="Any" class="p-column-filter">
                                <template #option="slotProps">
                                    <div class="p-multiselect-representative-option">
                                        <img :alt="slotProps.option.name" :src="contextPath + 'demo/images/avatar/' + slotProps.option.image" width="32" style="vertical-align: middle" />
                                        <span style="margin-left: 0.5em; vertical-align: middle" class="image-text">{{ slotProps.option.name }}</span>
                                    </div>
                                </template>
                            </MultiSelect>
                        </template>
                    </Column>
                    <Column header="Date" filterField="date" dataType="date" style="min-width: 10rem">
                        <template #body="{ data }">
                            {{ formatDate(data.date) }}
                        </template>
                        <template #filter="{ filterModel }">
                            <Calendar v-model="filterModel.value" dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" />
                        </template>
                    </Column>
                    <!--                    <Column header="Balance" filterField="balance" dataType="numeric" style="min-width: 10rem">-->
                    <!--                        <template #body="{ data }">-->
                    <!--                            {{ formatCurrency(data.balance) }}-->
                    <!--                        </template>-->
                    <!--                        <template #filter="{ filterModel }">-->
                    <!--                            <InputNumber v-model="filterModel.value" mode="currency" currency="USD" locale="en-US" />-->
                    <!--                        </template>-->
                    <!--                    </Column>-->
                    <Column field="status" header="Status" :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem">
                        <template #body="{ data }">
                            <span :class="'customer-badge status-' + data.status">{{ data.status }}</span>
                        </template>
                        <template #filter="{ filterModel }">
                            <Dropdown v-model="filterModel.value" :options="statuses" placeholder="Any" class="p-column-filter" :showClear="true">
                                <template #value="slotProps">
                                    <span :class="'customer-badge status-' + slotProps.value" v-if="slotProps.value">{{ slotProps.value }}</span>
                                    <span v-else>{{ slotProps.placeholder }}</span>
                                </template>
                                <template #option="slotProps">
                                    <span :class="'customer-badge status-' + slotProps.option">{{ slotProps.option }}</span>
                                </template>
                            </Dropdown>
                        </template>
                    </Column>
                    <Column field="activity" header="Activity" :showFilterMatchModes="false" style="min-width: 12rem">
                        <template #body="{ data }">
                            <ProgressBar :value="data.activity" :showValue="false" style="height: 0.5rem"></ProgressBar>
                        </template>
                        <template #filter="{ filterModel }">
                            <Slider v-model="filterModel.value" :range="true" class="m-3"></Slider>
                            <div class="flex align-items-center justify-content-between px-2">
                                <span>{{ filterModel.value ? filterModel.value[0] : 0 }}</span>
                                <span>{{ filterModel.value ? filterModel.value[1] : 100 }}</span>
                            </div>
                        </template>
                    </Column>
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
