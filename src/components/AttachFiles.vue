<script setup>
  import {defineEmits, defineProps, reactive, ref, toRaw, watch, computed} from 'vue';
  import ReviewsService from "../services/Reviews/ReviewsService";
  import FilesService from "../services/Files/FilesService";
  import toastService from '../services/Toast'
  import { useToast } from 'primevue/usetoast';

  const toast = useToast();


  const uploadInput = ref([]);

  const uploadProgress = ref(null);
  const emit = defineEmits(['update:attachFiles', 'delete:content']);
    const props = defineProps({
    files: {
        type: Object,
        required: true,}
        ,
        possibleTypeFiles:{
            type: Array,
            default(rawProps) {
                return [
                    'mp4',
                    'webm',
                    'mov',
                    'quicktime',
                    'jpeg',
                    'png',
                ]
            }
        },
    server:{
      type: Object,
      required: true,
        default:{},
      validator: function (settings) {
        if(!settings.url)  return false;

        return true;
      },
    },
        maxSizeFile:{
            type:Number,
            default:2000000000
        }
    });

  // const attachFiles = computed(() => {return [...props.files]});
  const attachedFiles = ref([]);
  const  attachFiles = computed({
      get: () => {attachedFiles.value = [...toRaw(props.files)]; return attachedFiles.value},
      set: (val) => {
          console.log('attachFiles')
          attachedFiles.value = val; }
  });

  // const uploadFiles =


  FilesService.setRequestInfo(props.server);

  const clickOnUpload = () => {
    uploadInput.value.click();
  }

  const handleFilesUpload = async (event) => {
    // const files = event.target.files;

    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const fileName = files[i].name;
        let mimeFile = ''
        if(files[i].type) mimeFile = files[i].type;
        if(mimeFile) mimeFile = mimeFile.split('/');
        if( mimeFile.length === 0 ) {
            toastService.duration(5000).error('Критическая ошибка, неверный формат загрузки файлов на сервер обратитесь к разработчикам' )
            continue;
        }
        const fileExtension = mimeFile[1]
        const typeFile = mimeFile[0]
//check file extension
        if(!props.possibleTypeFiles.includes(fileExtension)){
            toastService.duration(5000).error('Неверный тип файла ' + fileName + '. Допустимо до (' + props.possibleTypeFiles.join(', ') + ')', )
            continue;
        }
//check file size
        if(files[i].size < 200 || files[i].size > props.maxSizeFile){
            toastService.duration(5000).error('Слишком большой размер файла ' + fileName + '. (' + Math.round(files[i].size/1000)  +' kb) Допустимо ' + Math.round(props.maxSizeFile/1000) +'kb', )
            continue;
        }


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
    for ( const i in files ) {
      let aIndex =  files[i].attachFileIndex;
      if(!attachFiles.value[aIndex]) continue;
      let res = await FilesService.fileUpload(files[i], {
        onUploadProgress:  progressEvent => {
            attachFiles.value[aIndex].loadPersent = Math.round(progressEvent.loaded * 100 / progressEvent.total);
          //todo save all upload progress
        }
      })

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

    console.log('all files upload!')
    emit('update:attachFiles', toRaw(attachFiles.value.filter((f)=>(!f.isDeleted))) );
  }
  const  removeFile = async(file) => {
      if(!file.id)  return false;
      const i = attachFiles.value.findIndex(aFile => aFile.id === file.id)
      if(i === -1) return false;
      //if file.confirm ===  1 temporally deactivate file only on front

      if(!file.confirm){
          attachFiles.value.splice(i, 1);
          const res = await FilesService.fileDelete(file);
          if(res && res.ok && res.message){
              toastService.success('Удаление файла', res.message)
              return true;
          }

      }else{
          attachFiles.value[i].isDeleted = true;
          emit('update:attachFiles', toRaw(attachFiles.value.filter((f)=>(!f.isDeleted))) );
      }
      // emit('delete:content', file);
  };
  const fileDeleted = (file) =>{
      return (file.isDeleted) ? {opacity:0.3}:{}
  }
  const isVideo = (file) => (file.typeFile?.indexOf('video') > -1)
  const isImage = (file) => (file.typeFile?.indexOf('image') > -1)

  // watch(props.files, () => {
  //   // Обработка изменений в selectedFiles
  //   console.log(props.files);
  // });
  //
  const files = computed(() => {
      return attachFiles.reverse()
  });

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
        <img v-if="isImage(file)" :src="(file.blobPath) ? file.blobPath :'http://127.0.0.1:8000'+file.url"  :key="index" :style="fileDeleted(file)">

<!--        <img v-if="file.type.startsWith('image')" :src="file.blobPath"  :key="index">-->
          <div v-else-if="isVideo(file)">
              <video  controls  style="height: 100%;width:50%">
                  <source :src="(file.blobPath) ? file.blobPath :'http://127.0.0.1:8000'+file.url">
              </video>
          </div>


      </div>


      <input style="display: none" ref="uploadInput" @change="handleFilesUpload" type="file" accept="video/*, image/*" multiple />
    </div>
    <div @click="clickOnUpload" class="attach-files__item add">
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
      width: 240px;
      height: 240px;
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
