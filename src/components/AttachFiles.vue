<script setup>
import {defineEmits, defineProps, reactive, ref, watch} from 'vue';
  const uploadInput = ref([]);
  const selectedFiles = reactive([]);
  const emit = defineEmits(['update:attachFiles', 'delete:content']);
  const props = defineProps({
    files: Object
  });
  const clickOnUpload = () => {
    uploadInput.value.click();
  }
  const handleFileUpload = (event) => {
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      files[i].blobPath = URL.createObjectURL(files[i]);
      selectedFiles.push(files[i]);
    }
    emit('update:attachFiles', selectedFiles);
    console.log(selectedFiles)
  };
  const removeFile = (index) => {
    const file = selectedFiles[index];
    URL.revokeObjectURL(file.blobPath);
    selectedFiles.splice(index, 1);
    emit('update:attachFiles', selectedFiles);
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
        <img v-if="/(jpg|png|jpeg|webp)$/.test(file.url)" :src="file.url"  :key="index">
        <video height="100" v-if="/(mp4)$/.test(file.url)">
          <source :src="file.url">
        </video>
      </div>
      <div v-if="Object.keys(selectedFiles).length > 0" v-for="(file, index) in selectedFiles" class="attach-files__item thumb">
        <div @click="removeFile(index)" class="pi pi-times delete-button"></div>
        <div class="pi pi-ellipsis-h load-button"></div>
        <img v-if="file.type.startsWith('image')" :src="file.blobPath"  :key="index">
        <video height="100" v-if="file.type.startsWith('video')">
          <source :src="file.blobPath">
        </video>
      </div>


      <input style="display: none" ref="uploadInput" @change="handleFileUpload" type="file" accept="video/*, image/*" multiple />
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