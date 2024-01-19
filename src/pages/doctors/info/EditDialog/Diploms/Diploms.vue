

<script setup>
import { defineProps, reactive, ref, toRef, defineEmits, computed, toRaw } from 'vue'
import AttachFiles from "@/components/AttachFiles/AttachFiles.vue";
import EditDialog from "@/pages/doctors/info/EditDialog/Diploms/EditDialog.vue";
import doctorsDiplomsService from "@/services/Doctors/DoctorsDiplomsService";
const props = defineProps({
    visible: Boolean,
    modelValue:{default:[]},
    doctor_id:{        required:true, type:Number   }
})

const emit = defineEmits(['update:visible', 'updated', 'update:modelValue'])

const visibleEditDialog = ref(false);
const editData = ref({});
const diploms = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        console.log(value)
        emit('update:modelValue', value)
    }
});

// const  diploms = computed({
//     get: () => {
//         attachedFiles.value = (Array.isArray(props.files)) ? [...toRaw(props.files)] : [];
//         return attachedFiles.value},
//     set: (val) => {
//         console.log('attachFiles')
//         // attachedFiles.value = val;
//     }
// });


const createItem =  (e) =>{
    visibleEditDialog.value = true;
    editData.value = {};
}

const onOpenEdit = (e) =>{
    console.log(e)
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

        <EditDialog v-model:visible="visibleEditDialog" v-model="editData" :doctor_id="props.doctor_id" @updated="emit('updated', $event)" />
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
                    <Button type="button" icon="pi pi-plus" label="Добавить диплом" class="p-button-outlined mb-2" @click="createItem" />
                </div>
            </template>
            <template #empty> No diploms found. </template>
            <Column field="id" header="id"/>
            <Column field="title" header="Title" style="min-width: 12rem">
                <template #body="{ data }">
                    <div class="flex justify-content-between flex-wrap">
                        <div class="flex align-items-center justify-content-center">{{data.title}}</div>
                        <AvatarGroup v-if="data.contentOriginal">

                            <Avatar v-for="content in data.contentOriginal" :image="content.url" size="large" shape="circle" />

                        </AvatarGroup>
                    </div>
                </template>
            </Column>

            <Column :rowEditor="true" style="width: 10%; min-width: 4rem" bodyStyle="text-align:center"></Column>
        </DataTable>

    </Panel>

</template>

<style scoped>

</style>