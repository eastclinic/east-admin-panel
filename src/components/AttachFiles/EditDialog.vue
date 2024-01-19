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
const uploadInput = ref([]);
const emit = defineEmits(['update:visible', 'updated', 'update:modelValue']);
let uploadContent = ref(false);
const editData = computed(() => props.modelValue);
const contentService = new ContentService();

const uploadVideoPreview = async (event) =>{
    const files = event.target.files;
    if(!files || files.length === 0) return ;
    const file = files[0];
    contentService.checkUploadFileParameters(file, props);
    const filesUploadInfo : PreviewUploadInfo = {filePreview:file,
        videoInfo:props.modelValue,
        targetId:props.targetId,
        targetType:props.targetType,
        previewForVideoId:editData.value.id
    };
    await contentService.uploadVideoPreviewFile( filesUploadInfo );
}


const save = async () => {
    const res = await contentService.save(JSON.parse(JSON.stringify(editData.value)))
    if(res.ok && res.message) {
        toastService.success(res.message);
        emit('updated', toRaw( editData.value));
    }


    emit('update:visible', false)

}
const deleteFile = async () => {
    const res = await contentService.fileDelete(JSON.parse(JSON.stringify(editData.value)))
    if(res.ok && res.message) {
        toastService.success(res.message);
        editData.value.isDeleted = true;
        emit('updated', toRaw( editData.value));
    }

    emit('update:visible', false)
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
                <div v-if="editData.previewOriginal && isVideo(editData)">
                    <div class="grid p-fluid">
                        <div class="col-12">
                            <img :src="editData.previewOriginal.url" class="preview__item thumb">
                        </div>
                        <div class="col-12">
                            <Button type="button" icon="pi pi-plus" label="заменить превью видео" class="p-button-outlined mb-2" @click="uploadInput.click()" />
                        </div>
                    </div>


                </div>
                <div v-else>
                    <Button type="button" icon="pi pi-plus" label="Выбрать превью видео" class="p-button-outlined mb-2" @click="uploadInput.click()" />
                </div>

            </div>
            <div class="col-12" v-else>

            </div>
            <div class="col-12  lg:col-4 ">
                <Button :disabled="uploadContent"  label="Сохранить" text :raised="true" @click="save"/>
            </div>
            <div class="col-12  lg:col-4 ">
                <Button label="Отмена" class="p-button-outlined" outlined severity="success" @click="dismissModal"/>
            </div>
            <div class="col-12  lg:col-4 " v-if="editData.id">
                <Button label="Удалить" class="p-button-outlined p-button-danger" @click="deleteFile"/>
            </div>
        </div>
        <input style="display: none" ref="uploadInput" @change="uploadVideoPreview" type="file" accept="image/*" />
    </Dialog>



</template>



<style scoped  lang="scss">
.preview {
    display: flex;
    overflow-x: scroll;
    margin-right: 5px;
    &::-webkit-scrollbar {
        width: 15px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
        border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
        background: transparent;
        background-clip: content-box;
        border: 5px solid transparent;
        border-radius: 20px;
    }
    @media (hover: hover) {
        &:hover {
            &::-webkit-scrollbar-thumb {
                background: rgba(135, 143, 162, 0.45);
                background-clip: content-box;
                border: 5px solid transparent;
                border-radius: 20px;
            }
        }
    }
    @media (hover: none) {
        &::-webkit-scrollbar {
            width: 5px;
        }
        &::-webkit-scrollbar-thumb {
            background: rgba(135, 143, 162, 0.45);;
            background-clip: content-box;
            border: 7px solid transparent;
            border-radius: 20px;
        }
    }
    &__item {
        max-height: 150px;
        position: relative;
        display: flex;
        flex-shrink: 0;

        &.add {
            background: #d5d5d5;
            border-radius: 10px;
            position: relative;
            cursor: pointer;
            & .upload-button {
                position: absolute;
                top: 42%;
                right: 44%;
            }

        }
        & .delete-button {
            position: absolute;
            top: 5px;
            right: 5px;
            display: none;
            cursor: pointer;
            z-index: 1000;
        }
        & .load-button {
            position: absolute;
            top: 5px;
            left: 5px;
        }
        &:hover .delete-button {
            display: block;
        }
        &.thumb {
            background-color: #f1f1f1;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            &:not(:last-child) {
                margin-right: 5px;
            }
            & img {

                width: 100%;
            }
        }

    }
}
</style>
