<script setup>
import { defineProps, reactive, ref, toRef, defineEmits, computed, toRaw } from 'vue'
import AttachFiles from "@/components/AttachFiles.vue";
import doctorDiplomsService from "@/services/Doctors/DoctorsDiplomsService";
import toastService from '@/services/Toast'
import ReviewsService from "@/services/Reviews/ReviewsService";
import {useConfirm} from "primevue/useconfirm";

const props = defineProps({
    visible: Boolean,
    modelValue:Object,
    doctor_id:{        required:true, type:Number   }
})
const emit = defineEmits(['update:visible', 'updated', 'update:modelValue']);
let uploadContent = ref(false);
const editedData = computed(() => props.modelValue);

const header = computed(() => (Object.keys(props.modelValue).length > 0) ? 'Редактирование диплома' : 'Создание нового диплома')


const dismissModal = () => emit('update:visible', false)
const saveItemData = async () => {
    const saveData = JSON.parse(JSON.stringify(editedData.value));
    saveData.doctor_id = props.doctor_id;
    const res = await doctorDiplomsService.save( saveData );
    if( res.data && res.data.id) {
        dismissModal();
        emit('updated', editedData.value.id);

        toastService.success('Диплом', 'Диплом сохранен')
    } else {
        toastService.error('Диплом', 'Ошибка сохранения диплома')
    }


}
const confirm = useConfirm();
const deleteDiplom = async ()   => {
    confirm.require({
        message: 'Удалить диплом?',
        header: 'Удаление диплома',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
            console.log('accept')
            const res = await doctorDiplomsService.delete(editedData.value.id);
            if(res.ok ) {
                toastService.duration(3000).success('Диплом', 'Диплом удален')
                dismissModal();
                emit('updated', editedData.value.id);
            }
        },
        reject: () => {         }
    });
}



</script>

<template>
    <ConfirmDialog></ConfirmDialog>
    <Dialog :visible="props.visible" modal :header="header" :style="{ width: '50vw' }" maximizable :dismissableMask="true"  @update:visible="emit('update:visible', $event)">
        <div class="grid p-fluid">
            <div class="col-12  lg:col-12 ">
                <InputText type="text" v-model:modelValue="editedData.title" placeholder="Title"/>
            </div>

            <div class="col-12">

            </div>
            <div class="col-12  lg:col-12 ">
                <AttachFiles
                        v-if="editedData.id"
                        v-model:files="editedData.content"
                        v-model:upload="uploadContent"
                        targetType="doctorDiplom"
                        :targetId="editedData.id"
                >
                    <!--                <template #controlFilePanel="file">-->
                    <!--                    <InputSwitch :modelValue="file.published" @update:modelValue="contentPublish($event, file)"/>-->
                    <!--                </template>-->
                </AttachFiles>
            </div>
            <div class="col-12  lg:col-4 ">
                <Button :disabled="uploadContent"  label="Сохранить" text :raised="true" @click="saveItemData"/>
            </div>
            <div class="col-12  lg:col-4 ">
                <Button label="Отмена" class="p-button-outlined" outlined severity="success" @click="dismissModal"/>
            </div>
            <div class="col-12  lg:col-4 " v-if="editedData.id">
                <Button label="Удалить" class="p-button-outlined p-button-danger" @click="deleteDiplom"/>
            </div>
        </div>
    </Dialog>



</template>



<style scoped>

</style>
