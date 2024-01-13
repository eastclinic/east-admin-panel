<script setup>
import { defineProps, reactive, ref, toRef, defineEmits, computed, toRaw } from 'vue'
import AttachFiles from "@/components/AttachFiles/AttachFiles.vue";
import doctorDiplomsService from "@/services/Doctors/DoctorsDiplomsService";
import toastService from '@/services/Toast'
import ReviewsService from "@/services/Reviews/ReviewsService";
import {useConfirm} from "primevue/useconfirm";
import ContentService from "@/services/Content/ContentService";

const props = defineProps({
    visible: Boolean,
    modelValue:Object,
})
const emit = defineEmits(['update:visible', 'updated', 'update:modelValue']);
let uploadContent = ref(false);
const editedData = computed(() => props.modelValue);

const dismissModal = () => emit('update:visible', false)
const saveItemData = async () => {
    const saveData = JSON.parse(JSON.stringify(editedData.value));
    saveData.doctor_id = props.doctor_id;
    const res = await doctorDiplomsService.save( saveData );
    if( res.data && res.data.id) {
        dismissModal();
        emit('updated', editedData.value.id);

        toastService.success('Контент', 'Контент сохранен')
    } else {
        toastService.error('Контент', 'Ошибка сохранения контента')
    }


}
const confirm = useConfirm();
const  removeFile = async(file) => {
    if(!file.id)  return false;
    const i = attachFiles.value.findIndex(aFile => aFile.id === file.id)
    if(i === -1) return false;
    //if file.confirm ===  1 temporally deactivate file only on front


    attachFiles.value[i].isDeleted = true;
    if(!file.confirm){
        attachFiles.value.splice(i, 1);
        const res = await ContentService.fileDelete(file);
        if(res && res.ok && res.message){
            toastService.success('Удаление файла', res.message)
            return true;
        }

    }else{
        attachFiles.value[i].isDeleted = true;
        emit('update:files', toRaw(attachFiles.value) );
    }
};



</script>

<template>
    <ConfirmDialog></ConfirmDialog>
    <Dialog :visible="props.visible" modal header="Редактирование контента" :style="{ width: '50vw' }" maximizable :dismissableMask="true"  @update:visible="emit('update:visible', $event)">
        <div class="grid p-fluid">
            <div class="col-12  lg:col-12 ">
                <InputText type="text" v-model:modelValue="editedData.title" placeholder="Title"/>
            </div>

            <div class="col-12">

            </div>
            <div class="col-12  lg:col-12 ">
                <AttachFiles
                        v-if="editedData.id"
                        v-model:files="editedData.contentOriginal"
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
