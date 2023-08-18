<template>
    <Dialog :visible="props.visible" modal
            :header="header"
            :style="{ width: '50vw' }"
            maximizable
            :dismissableMask="true"
            @update:visible="dismissModal"
            @show="showModal"
            @hide="editedData = {}"
    >
        {{editedData}}
        <div class="grid p-fluid ">
            <div class="col-12  lg:col-12">
                <div class="flex flex-wrap">
                    <div class="flex align-items-center justify-content-center m-2">
                        <InputSwitch v-model="editedData.published"/>
                    </div>
                    <div class="flex align-items-center justify-content-center m-2">
                        <label >Опубликован</label>
                    </div>
                </div>


        </div>
            <div class="col-12  lg:col-6 ">
                <span class="p-input-icon-left">
                    <i class="pi pi-user" />
                    <InputText type="text" v-model="editedData.author"/>
                </span>
            </div>
            <div class="col-12 lg:col-6 ">
                    <InputNumber v-model="editedData.rating" :min="1" :max="100" />
            </div>
<!--          <div class="col-12 ">-->
<!--              <div class="flex gallery-item-container" v-for="item in props.editData.content">-->
<!--                <div style="position:relative" class="gallery-item">-->
<!--                  <div class="pi pi-video p-button-icon video-icon"></div>-->
<!--                  <video height="100">-->
<!--                    <source :src="item.url" type="video/mp4">-->
<!--                  </video>-->
<!--                </div>-->
<!--                <div style="position:relative" class="gallery-item">-->
<!--                  <div class="pi pi-close p-button-icon video-icon"></div>-->
<!--                  <img src="https://eastclinic.ru/assets/resourceimages/9788/_232x269/Gybarev1_2.0_232x269.webp">-->
<!--                </div>-->

<!--              </div>-->
<!--          </div>-->
            <div class="col-12">
              <AttachFiles :files="editedData.content"
                           @delete:content="removeContent"
                           @update:attachFiles="updateAttach"
                           :server="{
                               url:ReviewsService.getApiContentUrl(),
                               requestData:{
                                   id : props.editData.id
                               , contentable_type:'review'}}"
              />

            </div>
            <div class="col-12">
                <Textarea v-model="editedData.text" rows="5" autoResize  />
            </div>
            <div class="col-12  lg:col-6 ">
                <Button label="Сохранить" text :raised="true" @click="updateReview"/>
            </div>
            <div class="col-12  lg:col-6 ">
                <Button label="Отмена" class="p-button-outlined" outlined severity="success" @click="emit('update:visible', false)"/>
            </div>
<!--          <div class="col-12  lg:col-6 ">-->
<!--            <img v-for="item in props.editData.content" :src="item.url">-->
<!--          </div>-->

        </div>
    </Dialog>



</template>

<script setup>
    import { defineProps, reactive, ref, toRefs, defineEmits, computed, toRaw, onBeforeUpdate  } from 'vue'
    import ReviewsService from "../../services/Reviews/ReviewsService";
    import AttachFiles from "@/components/AttachFiles.vue";
    import FilesService from "../../services/Files/FilesService";


    const props = defineProps({
        visible: Boolean,
        editData:Object
    })
    let attachFiles = {};
    const emit = defineEmits(['update:visible', 'updated:review', 'created:review'])
    let  editedData = reactive(props.editData);
    const header = computed(() => (props.editData?.id) ? 'Редактирование отзыва' : 'Создание нового отзыва');
    const reviewsService = ReviewsService;
    //const currentId = (props.editData?.id) ? props.editData.id : Math.floor(Math.random() * (4100000000 - 4000000000 + 1)) + 4000000000;

    const attachFilesServerSettings = computed(() => {return {
        url:ReviewsService.getApiContentUrl(),
            requestData:{
                reviewId : (props.editData?.id) ? props.editData.id : Date.now() / 1000 | 0,
        }
    }});

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
    const updateAttach = async (files) => {
        const requestData = (editedData.id) ? {id : editedData.id, contentable_type:'review'} : {};
        const res = await ReviewsService.saveContent(files, requestData);
        // const res = await FilesService.filesUpload(files);


        console.log(editedData)
        // if(res.ok ) {
        //     if(editedData.id){
        //         //emit('updated:review', editedData.id);
        //     }else{
        //         //emit('created:review');
        //     }
        //
        // }
      // attachFiles = files;
    };
    const removeContent = (index) => {
      console.log('rem')
      editedData.content.splice(index, 1);
    };
    onBeforeUpdate(()=>{
        //todo its may be wrong
        editedData = reactive({...toRaw(props.editData)});
    });



    const saveReview = async (editedData) => {
        if(props?.editData?.id) editedData.id = props.editData.id;
        else {

            if(!editedData.reviewable_type) editedData.reviewable_type = 'doctor';
            if(!editedData.reviewable_id) editedData.reviewable_id = 3;
        }
        if(Object.keys(attachFiles).length > 0) {
          editedData.attach = attachFiles;
        }
        console.log({...editedData})

        return  await ReviewsService.saveReview(editedData);
    }
    const showModal = async () =>{
        if(props?.editData?.is_new){
            editedData.is_new = false;
            await saveReview(toRaw(editedData));
            emit('updated:review', props.editData.id);
        }
    }
    const dismissModal = () => {
        // editedData = {};
        emit('update:visible', false)

    };
    const value1 = ref(42723);

</script>

<style scoped>
.video-icon {
  width: 30px;
  height: 30px;
  position: absolute;
}
.gallery-item-container {
  display:flex;
  flex-direction: row;
  flex-shrink: 0;
}
.gallery-item {
  width: 100px;
  height: 100px;
}
.gallery-item img {
  width: 100%;
}
</style>
