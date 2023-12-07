<script setup>
import {defineEmits, defineProps, reactive, ref, toRaw, watch, computed, onMounted} from 'vue';
  import ContentService from "@/services/Content/ContentService";
  import toastService from '../services/Toast'
  import { useToast } from 'primevue/usetoast';
import ListRequest from "@/api/apiRequestAdapters/ListRequestAdapter";
import fileUploadRequest from "@/services/Content/FileUploadRequest";

  const toast = useToast();



    const uploadInput = ref([]);
    const uploadVideoPreview = ref([]);

    const uploadProgress = ref(null);
    const emit = defineEmits(['update:content', 'delete:content', 'saved:content', 'updated:content', 'updating:content', 'update:upload', 'update:files' ]);
//
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


const attachedFiles = ref([]);
  onMounted(async () => {

  });

  // const attachFiles = computed(() => {return [...props.files]});
//todo add opportunity set files from parent component
  const  attachFiles = computed({
      get: () => {
          console.log(props.targetId)
          attachedFiles.value = (Array.isArray(props.files)) ? [...toRaw(props.files)] : [];
      return attachedFiles.value},
      set: (val) => {
          console.log('attachFiles')
          // attachedFiles.value = val;
      }
  });



  const OnUpload = () => {
    uploadInput.value.click();
  }

const OnUploadPreviewForVideoId = (videoId) => {
    uploadVideoPreview.value.videoId = videoId;
    uploadVideoPreview.value.click();
}

const checkUploadFileParameters = (file) => {
    const fileName = file.name;
    let mimeFile = ''
    if(file.type) mimeFile = file.type;
    if(mimeFile) mimeFile = mimeFile.split('/');
    if( mimeFile.length === 0 ) {
        toastService.duration(5000).error('Критическая ошибка, неверный формат загрузки файлов на сервер обратитесь к разработчикам' )
        return ;
    }
    const fileExtension = ContentService.getFileExtension(file);

//check file extension
    if(!props.possibleExtensions.includes(fileExtension)){
        toastService.duration(5000).error('Неверный тип файла ' + fileName + '. Допустимо до (' + props.possibleExtensions.join(', ') + ')', )
        return;
    }
//check file size
    if(file.size < 200 || file.size > props.maxSizeFile){
        toastService.duration(5000).error('Слишком большой размер файла ' + fileName + '. (' + Math.round(file.size/1000)  +' kb) Допустимо ' + Math.round(props.maxSizeFile/1000) +'kb', )
        return;
    }
    return true;
}

  const uploadVideoPreviewFiles = async (event) =>{
      if(!uploadVideoPreview.value.videoId) return ;
      const files = event.target.files;
      if(!files || files.length === 0) return ;
      const file = files[0];
      if (!checkUploadFileParameters(file)) return ;


      let res = await ContentService.fileUpload(
          fileUploadRequest
              .forFile(file)
              .with('contentable_id', props.targetId)
              .with('contentable_type', props.targetType)
      );

      if(res?.data?.id ){
          for (const fileIndex in attachedFiles.value) {
              if(attachedFiles.value[fileIndex].id === uploadVideoPreview.value.videoId){
                  attachedFiles.value[fileIndex].preview = res.data;
              }
          }
            let fwsdf = attachedFiles.value
          debugger;
          toastService.duration(3000).success('Load image', 'Файл загружен')
      }else if(res.errors ) {
          for (const error in res.errors) {
              if (Array.isArray(res.errors[error])) {
                  for (const key in res.errors[error]) {
                      toastService.duration(5000).error('Load image', res.errors[error][key])
                  }

              }
          }


      }
  }




const uploadFiles = async (event) =>{
    await handleFilesUpload(event.target.files)
}


  const handleFilesUpload = async (files, options) => {


    // const files = event.target.files;


      // try {
      //     await ContentService.filesUpload(files, toRaw(props));
      // }catch (e){
      //     console.log(e)
      //     toastService.duration(5000).error(e.message);
      // }

      // return;

    for (let i = 0; i < files.length; i++) {
        if (!checkUploadFileParameters(files[i])) continue ;
        const typeFile = ContentService.getFileType(files[i])
      attachFiles.value.push( reactive({
        typeFile: typeFile,
        blobPath: URL.createObjectURL(files[i]),  //temp path for show image
        loadPersent: 0,
        errors: {},
        data:{},
        id:0,   //random temp id
        url:''
      }));
        files[i].attachFileIndex = attachFiles.value.length-1;
    }

    debugger;
    for ( const i in files ) {
      let aIndex =  files[i].attachFileIndex;
      if(!attachFiles.value[aIndex]) continue;
      let res = await ContentService.fileUpload(
          fileUploadRequest
              .forFile(files[i])
              .with('contentable_id', props.targetId)
              .with('contentable_type', props.targetType)
              .withUploadProgressCallback(progressEvent => {
                  attachFiles.value[aIndex].loadPersent = Math.round(progressEvent.loaded * 100 / progressEvent.total);
                  //todo save all upload progress
              })
      );

      if(res.data ){
          attachFiles.value[aIndex] = {...res.data}
          toastService.duration(3000).success('Load image', 'Файл загружен')
      }else if(res.errors ){
          for ( const error in res.errors){
              if(Array.isArray(res.errors[error])){
                  for ( const key in res.errors[error]){
                      toastService.duration(5000).error('Load image', res.errors[error][key])
                  }

              }
          }
          attachFiles.value.splice(aIndex, 1);
      }
    }

    emit('update:files', toRaw(attachFiles.value.filter((f)=>(!f.isDeleted))) );
    emit('update:upload', false);
  }



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
          emit('update:content', toRaw(attachFiles.value) );
      }
  };
  const fileDeleted = (file) =>{
      return (file.isDeleted) ? {opacity:0.3}:{}
  }
  const isVideo = (file) => (file.typeFile?.indexOf('video') > -1)
  const isImage = (file) => (file.typeFile?.indexOf('image') > -1)




</script>

<template>
  <div class="flex">
    <div class="attach-files">
<!--      <div v-for="(file, index) in files2" class="attach-files__item thumb">-->
<!--        <div @click="removeFile(file)" class="pi pi-times delete-button"></div>-->

<!--        <img v-if="/(jpg|png|jpeg|webp)$/.test(file.url)" :src="'http://127.0.0.1:8000'+file.url"  :key="index">-->
<!--        <video height="100" v-if="/(mp4)$/.test(file.url)">-->
<!--          <source :src="file.url">-->
<!--        </video>-->
<!--      </div>-->
      <div v-if="attachFiles.length > 0" v-for="(file, index) in attachFiles" class="attach-files__item thumb">
          <div>
              <slot name="controlFilePanel" v-bind="file">

                  <div class="pi pi-ellipsis-h load-button"> </div>
              </slot>
              <slot name="controlFileDelete">
                  <div @click="removeFile(file)" class="pi pi-times delete-button" v-if="(file?.id)"></div>
              </slot>
          </div>

          {{file.loadPersent}}
        <img v-if="isImage(file)" :src="(file.blobPath) ? file.blobPath :file.url"  :key="index" :style="fileDeleted(file)">

<!--        <img v-if="file.type.startsWith('image')" :src="file.blobPath"  :key="index">-->
          <div v-else-if="isVideo(file)">
              <Button v-if="file.url" icon="pi pi-clone" aria-label="Submit" @click="OnUploadPreviewForVideoId(file.id)" />
              <video  controls  style="height: 100%;width:50%">
                  <source :src="(file.blobPath) ? file.blobPath :file.url">
              </video>
              <img v-if="file.preview" :src="file.preview.url">

          </div>


      </div>

        <input style="display: none" ref="uploadVideoPreview" @change="uploadVideoPreviewFiles" type="file" accept="image/*" />
      <input style="display: none" ref="uploadInput" @change="uploadFiles" type="file" accept="video/*, image/*" multiple />

    </div>
    <div @click="OnUpload" class="attach-files__item add">
      <div  class="pi pi-upload upload-button"></div>
    </div>
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
    width: 100px;
    height: 100px;
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
