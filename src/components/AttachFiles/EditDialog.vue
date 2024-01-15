<script setup lang="ts">
import { defineProps, reactive, ref, toRef, defineEmits, computed, toRaw } from 'vue'
import toastService from '@/services/Toast.js'
import {useConfirm} from "primevue/useconfirm";
import ContentService from "@/services/Content/ContentService";
import FilesUploadInfo from "@/interfaces/AttachFiles/FilesUploadInfo";
import PreviewUploadInfo from "@/interfaces/AttachFiles/PreviewUploadInfo";

const props = defineProps({
    visible: Boolean,
    modelValue:Object,
    targetType:{required: true, type:String,},
    targetId:{required: true, type:Number,},
})
const emit = defineEmits(['update:visible', 'updated', 'update:modelValue']);
let uploadContent = ref(false);
const editData = computed(() => props.modelValue);
const contentService = new ContentService();

const uploadVideoPreview = async (event) =>{
    debugger
    const files = event.target.files;
    if(!files || files.length === 0) return ;
    const file = files[0];
    contentService.checkUploadFileParameters(file, props);
    const filesUploadInfo : PreviewUploadInfo = {filePreview:file, videoInfo:props.modelValue, targetId:props.targetId, targetType:props.targetType};
    await contentService.uploadVideoPreviewFile( filesUploadInfo );
}



const dismissModal = () => emit('update:visible', false)

const confirm = useConfirm();
const isVideo = (file) => (file.typeFile?.indexOf('video') > -1)
const isImage = (file) => (file.typeFile?.indexOf('image') > -1)

</script>

<template>
    <ConfirmDialog></ConfirmDialog>
    <Dialog :visible="props.visible" modal header="Редактирование контента" :style="{ width: '50vw' }" maximizable :dismissableMask="true"  @update:visible="emit('update:visible', $event)">
        <div class="grid p-fluid">
            <div class="col-12  lg:col-12 ">
                <InputText type="text" v-model:modelValue="editData.alt" placeholder="Alt"/>
            </div>

            <div class="col-12" v-if="isVideo(editData)">
                <div v-if="editData.preview">
                    <img v-if="isImage(editData)" :src="(editData.blobPath) ? editData.blobPath :editData.url" class="attach-files__item thumb">
                    <div v-else-if="isVideo(editData)">
                        <Button v-if="data.url" icon="pi pi-clone" aria-label="Submit" @click="uploadVideoPreview.click()" />
                        <video>
                            <source :src="(data.blobPath) ? data.blobPath :data.url">
                        </video>
                        <img v-if="data.preview" :src="data.preview.url">

                    </div>
                </div>
                <div v-else>
                    <Button type="button" icon="pi pi-plus" label="Выбрать превью видео" class="p-button-outlined mb-2" @click="uploadInput.click()" />
                </div>

            </div>
            <div class="col-12" v-else>

            </div>
            <div class="col-12  lg:col-4 ">
                <Button :disabled="uploadContent"  label="Сохранить" text :raised="true" @click="saveItemData"/>
            </div>
            <div class="col-12  lg:col-4 ">
                <Button label="Отмена" class="p-button-outlined" outlined severity="success" @click="dismissModal"/>
            </div>
            <div class="col-12  lg:col-4 " v-if="editData.id">
                <Button label="Удалить" class="p-button-outlined p-button-danger" @click="deleteDiplom"/>
            </div>
        </div>
        <input style="display: none" ref="uploadInput" @change="uploadVideoPreview" type="file" accept="image/*" />
    </Dialog>



</template>



<style scoped>

</style>
