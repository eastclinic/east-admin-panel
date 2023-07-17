<script setup>
  import {defineEmits, defineProps, reactive, ref, toRaw, watch} from 'vue';
  import ReviewsService from "../services/Reviews/ReviewsService";
  import FilesService from "../services/Files/FilesService";



  const uploadInput = ref([]);
  const selectedFiles = reactive({});
  const uploadProgress = ref(null);
  const emit = defineEmits(['update:attachFiles', 'delete:content']);
  const props = defineProps({
    files: Object,
    server:{
      type: Object,
      required: true,
      validator: function (settings) {
        if(!settings.url)  return false;

        return true;
      },
    },
  });


  const clickOnUpload = () => {
    uploadInput.value.click();
  }


  const updateReview = async () => {
    const res = await saveReview(toRaw(editedData));


    if(res.ok ) {
      if(editedData.id){
        emit('updated:review', editedData.id);
      }else{
        emit('created:review');
      }

    }
    dismissModal();
  };

  const handleFilesUpload = async (event) => {
    // const files = event.target.files;

    const filesSelected = event.target.files;
    const files = event.target.files;

    for (let i = 0; i < filesSelected.length; i++) {
      filesSelected[i].blobPath = URL.createObjectURL(filesSelected[i]);
      const fileId = filesSelected[i].blobPath;
      selectedFiles[fileId] = reactive(filesSelected[i]);
      selectedFiles[fileId]['loadPersent'] = ref(0);
      selectedFiles[fileId]['errors'] = ref({});

      let res = await FilesService.fileUpload(filesSelected[i], {
        ...props.server,
        onUploadProgress:  progressEvent => {
          console.log(progressEvent)
          selectedFiles[fileId]['loadPersent'].value = Math.round(progressEvent.loaded * 100 / progressEvent.total);
          console.log(selectedFiles)
          // save the individual file's progress percentage in object
          // this.fileProgress[file.name] = progressEvent.loaded * 100 / progressEvent.total
          // sum up all file progress percentages to calculate the overall progress
          // let totalPercent = this.fileProgress ? Object.values(this.fileProgress).reduce((sum, num) => sum + num, 0) : 0
          // // divide the total percentage by the number of files
          // this.progress.percent = parseInt(Math.round(totalPercent / this.progress.total))
          // uploadProgress.value =
        }
      })
      console.log(res)


    }

    console.log('all files upload!')
    //emit('update:attachFiles', event.target.files);
  }
  const removeFile = (index) => {
    const file = selectedFiles[index];
    URL.revokeObjectURL(file.blobPath);
    selectedFiles.splice(index, 1);
    //emit('update:attachFiles', selectedFiles);
  };
  const removeContent = (index) => {
    emit('delete:content', index);
  };
  watch(props.files, () => {
    // Обработка изменений в selectedFiles
    console.log(props.files);
  });
</script>

<template>
  <div class="flex">

    <div class="attach-files">
      <div v-for="(file, index) in files" class="attach-files__item thumb">
        <div @click="removeContent(index)" class="pi pi-times delete-button"></div>

        <img v-if="/(jpg|png|jpeg|webp)$/.test(file.url)" :src="'http://127.0.0.1:8000'+file.url"  :key="index">
        <video height="100" v-if="/(mp4)$/.test(file.url)">
          <source :src="file.url">
        </video>
      </div>
      <div v-if="Object.keys(selectedFiles).length > 0" v-for="(file, index) in selectedFiles" class="attach-files__item thumb">

        <div @click="removeFile(index)" class="pi pi-times delete-button"></div>
        <div class="pi pi-ellipsis-h load-button"> {{file.loadPersent}}  {{file.errors}}</div>
        <img v-if="file.type.startsWith('image')" :src="file.blobPath"  :key="index">
        <video height="100" v-if="file.type.startsWith('video')">
          <source :src="file.blobPath">
        </video>

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
