<script setup lang="ts">

import {defineEmits, defineProps, reactive, ref, toRaw, watch, computed, onMounted} from 'vue';
import ContentService from '@/services/Content/ContentService.js';
import toastService from '@/services/Toast.js'
import EditDialog from '@/components/AttachFiles/EditDialog.vue';
import FilesUploadInfo from "@/interfaces/AttachFiles/FilesUploadInfo";

    const props = defineProps({
    files: {
        type: Array,
        default:[]}
    ,
    possibleExtensions:{
        type: Array,
        default(rawProps) {
            return [
                'mp4',
                'webm',
                'webp',
                'mov',
                'quicktime',
                'jpeg',
                'png',
            ]
        }
    },
    targetType:{required: true, type:String,},
    targetId:{required: true, type:Number,},
    maxSizeFile:{
        type:Number,
        default:2000000000
    },
    upload:{type:Boolean}
});

    const contentService = (new ContentService()).with('targetId', props.targetId).with('targetType', props.targetType);

    const visibleEditDialog = ref(false);

    const uploadInput = ref([]);
    const uploadVideoPreview = ref([]);
    const editData = ref({});
    const uploadProgress = ref(null);
    const emit = defineEmits(['update:content', 'delete:content', 'saved:content', 'updated:content', 'updating:content', 'update:upload', 'update:files' ]);

    //todo add opportunity set files from parent component
    const  attachFiles = computed(() => props.files);




    const filesUpload = async (event) => {
        try {
            if (!contentService.checkUploadFileParameters(event.target.files, props)) return ;
            const filesUploadInfo : FilesUploadInfo = {files:event.target.files, attachFiles:attachFiles, targetId:props.targetId, targetType:props.targetType};

          await contentService.filesUpload( filesUploadInfo );
        }catch (e){
          console.log(e)
          toastService.duration(5000).error(e.message);
        }
        emit('update:files', toRaw(attachFiles.value.filter((f)=>(!f.isDeleted))) );
        emit('update:upload', false);
    }
    const removeFile = async (file) => {
        await contentService.removeFile(file);
        emit('update:files', toRaw(attachFiles.value) );
    }


    const fileIsDeleted = (file) =>{
      return (file.isDeleted) ? {opacity:0.3}:{}
    }
    const isVideo = (file) => (file.typeFile?.indexOf('video') > -1)
    const isImage = (file) => (file.typeFile?.indexOf('image') > -1)

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
    <EditDialog v-model:visible="visibleEditDialog" v-model="editData" @updated="emit('updated', $event)" :target-type="props.targetType" :target-id="props.targetId" />
  <div >
      <DataTable
              :value="attachFiles"
              class="p-datatable-gridlines"
              :rows="3"
              dataKey="id"
              :totalRecords="attachFiles.length"
              editMode="row"
              @row-edit-init="onOpenEdit"
      >
          <template #header>
              <div class="flex justify-content-between flex-column sm:flex-row">
                  <Button type="button" icon="pi pi-plus" label="Выбрать файлы" class="p-button-outlined mb-2" @click="uploadInput.click()" />
              </div>
          </template>
          <template #empty> No content found. </template>
          <Column field="id" header="id">
              <template #body="{ data }">
                  <div class="flex justify-content-between flex-wrap">
                      <div class="flex align-items-center justify-content-center">{{data.title}}</div>

                  </div>
              </template>
          </Column>
          <Column field="contentOriginal" header="File" style="min-width: 12rem">
              <template #body="{ data }">
                  <div class="flex justify-content-between flex-wrap">
                      <div>
                          <div>
                          <slot name="controlFilePanel" v-bind="data">

                              <div class="pi pi-ellipsis-h load-button"> </div>
                          </slot>
                          <slot name="controlFileDelete">
                              <div @click="removeFile(data)" class="pi pi-times delete-button" v-if="(data?.id)"></div>
                          </slot>
                      </div>
                          {{data.loadPersent}}
                      <img v-if="isImage(data)" :src="(data.blobPath) ? data.blobPath :data.url" class="attach-files__item thumb">

                      <div v-else-if="isVideo(data)">
                          <video class="attach-files__item thumb">
                              <source :src="(data.blobPath) ? data.blobPath :data.url">
                          </video>
                          <img v-if="data.preview" :src="data.preview.url">

                      </div>
                    </div>
                  </div>

              </template>
          </Column>

          <Column :rowEditor="true" style="width: 10%; min-width: 4rem" bodyStyle="text-align:center"></Column>
      </DataTable>

<!--    <div class="attach-files" >-->


<!--      <div v-if="attachFiles.length > 0" v-for="(file, index) in attachFiles" class="attach-files__item thumb" :style="fileIsDeleted(file)">-->
<!--          <div>-->
<!--              <slot name="controlFilePanel" v-bind="file">-->

<!--                  <div class="pi pi-ellipsis-h load-button"> </div>-->
<!--              </slot>-->
<!--              <slot name="controlFileDelete">-->
<!--                  <div @click="removeFile(file)" class="pi pi-times delete-button" v-if="(file?.id)"></div>-->
<!--              </slot>-->
<!--          </div>-->
<!--        <img v-if="isImage(file)" :src="(file.blobPath) ? file.blobPath :file.url"  :key="index">-->

<!--&lt;!&ndash;        <img v-if="file.type.startsWith('image')" :src="file.blobPath"  :key="index">&ndash;&gt;-->
<!--          <div v-else-if="isVideo(file)">-->
<!--              <Button v-if="file.url" icon="pi pi-clone" aria-label="Submit" @click="OnUploadPreviewForVideoId(file.id)" />-->
<!--              <video>-->
<!--                  <source :src="(file.blobPath) ? file.blobPath :file.url">-->
<!--              </video>-->
<!--              <img v-if="file.preview" :src="file.preview.url">-->

<!--          </div>-->


<!--      </div>-->

<!--        <input style="display: none" ref="uploadVideoPreview" @change="uploadVideoPreviewFiles" type="file" accept="image/*" />-->
<!--      <input style="display: none" ref="uploadInput" @change="filesUpload" type="file" accept="video/*, image/*" multiple />-->

<!--    </div>-->
      <input style="display: none" ref="uploadInput" @change="filesUpload" type="file" accept="video/*, image/*" multiple />
  </div>

</template>

<style scoped lang="scss">
.attach-files {
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
