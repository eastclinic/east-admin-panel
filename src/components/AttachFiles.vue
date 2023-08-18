<script setup>
  import {defineEmits, defineProps, reactive, ref, toRaw, watch} from 'vue';
  import ReviewsService from "../services/Reviews/ReviewsService";
  import FilesService from "../services/Files/FilesService";
  import toastService from '../services/Toast'
  import { useToast } from 'primevue/usetoast';

  const toast = useToast();


  const uploadInput = ref([]);
  const selectedFiles = reactive({});
  const uploadProgress = ref(null);
  const emit = defineEmits(['update:attachFiles', 'delete:content']);
  const props = defineProps({
    files: Object,
    server:{
      type: Object,
      required: true,
        default:{},
      validator: function (settings) {
        if(!settings.url)  return false;

        return true;
      },
    },
  });

  for (let i = 0; i < props.files.length; i++) {
    selectedFiles[ i ] = reactive({...props.files[i]})
  }
  FilesService.setRequestInfo(props.server);

  const clickOnUpload = () => {
    uploadInput.value.click();
  }

  const handleFilesUpload = async (event) => {
    // const files = event.target.files;

    const filesSelected = event.target.files;
    const files = event.target.files;

    for (let i = 0; i < filesSelected.length; i++) {
      //filesSelected[i].blobPath = URL.createObjectURL(filesSelected[i]);
      //console.log(filesSelected[i])
      const fileId = filesSelected[i].blobPath;
      selectedFiles[i] = reactive({
        type: filesSelected[i].type,
        blobPath: URL.createObjectURL(filesSelected[i]),
        loadPersent: 0,
        errors: {},
        data:{},
        id:0,
        url:''
      });
    }
    for (let i = 0; i < filesSelected.length; i++) {
      let res = await FilesService.fileUpload(filesSelected[i], {
        onUploadProgress:  progressEvent => {
          console.log(progressEvent)
          selectedFiles[i].loadPersent = Math.round(progressEvent.loaded * 100 / progressEvent.total);
          //todo save all upload progress
        }
      })

      if(res.data && selectedFiles[i]){
        selectedFiles[i].data = res.data
        selectedFiles[i].id = res.data.id;
        selectedFiles[i].url = res.data.url;

          toastService.duration(3000).success('Load image', 'Файл загружен')
      }else if(res.errors && selectedFiles[i]){
          // selectedFiles[i].errors = [];
          for ( const error in res.errors){
              if(Array.isArray(res.errors[error])){
                  for ( const key in res.errors[error]){
                      toastService.duration(5000).error('Load image', res.errors[error][key])
                  }

              }
          }
          delete selectedFiles[i];

      }

        console.log(selectedFiles[i])

    }

    console.log('all files upload!')
    //emit('update:attachFiles', event.target.files);
  }
  const  removeFile = async(file) => {
      if( file.id){
          let removedFile = null;
          for(const key in selectedFiles){
              if( selectedFiles[key]['id'] === file.id ){
                  removedFile = selectedFiles[key];
                  delete selectedFiles[key];
                  break;
              }
          }

          //save removed file, for use if we need
          if(removedFile){
              console.log(removedFile)
          }
          await removeContent(file)
      }
      emit('delete:content', file);
  };
  const  removeContent = async(file) => {
      if(!file.id)  return false;

    const res = await FilesService.fileDelete(file);
    if(res && res.ok && res.message){
        toastService.success('Удаление файла', res.message)
        return true;

    }

  };
  watch(props.files, () => {
    // Обработка изменений в selectedFiles
    console.log(props.files);
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
      <div v-if="Object.keys(selectedFiles).length > 0" v-for="(file, index) in selectedFiles" class="attach-files__item thumb">
        <div @click="removeFile(file)" class="pi pi-times delete-button"></div>
        <div class="pi pi-ellipsis-h load-button"> </div>

        <img :src="(file.blobPath) ? file.blobPath :'http://127.0.0.1:8000'+file.url"  :key="index">

<!--        <img v-if="file.type.startsWith('image')" :src="file.blobPath"  :key="index">-->
<!--        <video height="100" v-if="file.type.startsWith('video')">-->
<!--          <source :src="file.blobPath">-->
<!--        </video>-->

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
