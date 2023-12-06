

<script setup>
import { defineProps, reactive, ref, toRef, defineEmits, computed, toRaw } from 'vue'
import AttachFiles from "@/components/AttachFiles.vue";
import EditDialog from "@/pages/doctors/info/EditDialog/Diploms/EditDialog.vue";
import doctorsDiplomsService from "@/services/Doctors/DoctorsDiplomsService";
const props = defineProps({
    visible: Boolean,
    modelValue:{default:[]},
    doctor_id:{        required:true, type:Number   }
})

const emit = defineEmits(['update:visible', 'update:modelValue'])

const visibleEditDialog = ref(false);
const editData = ref({});
const diploms = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    }
});


const createItem =  (e) =>{
    visibleEditDialog.value = true;
    editData.value = {};
}

const onOpenEdit = async (e) =>{
    visibleEditDialog.value = true;
    editData.value = e.data;
}




</script>


<template>
    <Panel header="Дипломы" toggleable collapsed   >
        <template #header>
            <div class="flex align-items-center gap-2">

                <span class="font-bold">Дипломы</span>
            </div>
        </template>
        <template #icons v-if="diploms && diploms.length > 0">
            <Badge :value="diploms.length"  class="ml-auto" />
        </template>


{{diploms}}
        <EditDialog v-model:visible="visibleEditDialog" v-model="editData" :doctor_id="props.doctor_id" />
        <DataTable
                :value="diploms"
                class="p-datatable-gridlines"
                :rows="3"
                dataKey="id"
                :totalRecords="props.modelValue.length"
                editMode="row"
                @row-edit-init="onOpenEdit"
        >
            <template #header>
                <div class="flex justify-content-between flex-column sm:flex-row">
                    <Button type="button" icon="pi pi-plus" label="New" class="p-button-outlined mb-2" @click="createItem" />
                </div>
            </template>
            <template #empty> No customers found. </template>
            <template #loading> Загрузка докторов. Пожалуйста подождите. </template>
            <Column field="title" header="Title" style="min-width: 12rem"/>

            <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
        </DataTable>

    </Panel>

</template>

<style scoped>

</style>