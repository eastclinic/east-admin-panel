
<script setup >

    import { defineProps, reactive, ref, toRefs, defineEmits, computed, toRaw, onBeforeUpdate, watchEffect  } from 'vue'
    import ReviewsService from "../../services/Reviews/ReviewsService";
    import AttachFiles from "@/components/AttachFiles.vue";
    import FilesService from "../../services/Files/FilesService";
    import { useConfirm } from "primevue/useconfirm";
    import toastService from '@/services/Toast'
    import { useToast } from 'primevue/usetoast';
    import DoctorsInfoService from "../../services/Doctors/DoctorsInfoService";
    import DoctorsListService from "../../services/Doctors/DoctorsListService";


    const toast = useToast();
    const doctorsListService = ref(DoctorsListService);

    // console.log(DoctorsInfoService)
    const confirm = useConfirm();
    const props = defineProps({
        visible: Boolean,
        editData:Object
    })
    const dataUpdated = ref(false);
    const emit = defineEmits(['update:visible', 'updated:review', 'created:review', 'deleted:review'])
    // const  editedData = reactive(props.message);

    const editData = ref({});
    const  editDataComputed = computed(() => { editData.value = JSON.parse(JSON.stringify(props.editData)); return editData.value});

    const header = computed(() => (props.editData?.id) ? 'Редактирование отзыва' : 'Создание нового отзыва');
    const reviewsService = ReviewsService;
    //const currentId = (props.editData?.id) ? props.editData.id : Math.floor(Math.random() * (4100000000 - 4000000000 + 1)) + 4000000000;

    const tempReviewId = computed(()=> (props.editData?.id) ? props.editData.id : Math.floor(Math.random() + Date.now() / 1000 | 0))
    const attachFilesServerSettings = computed(() => {return {
        url:ReviewsService.getApiContentUrl(),
        requestData:{
            reviewId : (props.editData?.id) ? props.editData.id : Date.now() / 1000 | 0,
        }
    }});

    const contentPublish = (publish, contentInfo)=>{
        for(const f in editData.value.content){
            if(editData.value.content[f].id === contentInfo.id){
                editData.value.content[f].published = publish;
            }
        }
    }
    const saveReview = async () => {
        console.log(JSON.stringify(editData.value))
        console.log(JSON.stringify(props.editData))
        if(JSON.stringify(editData.value) !== JSON.stringify(props.editData)){
            const res = await saveReviewToServer(toRaw(editData.value));
            if(res.ok ) {
                if(editData.value.id){
                    toastService.duration(3000).success('Отзыв', 'Отзыв обновлен')
                    emit('updated:review', editData.value.id);

                }else{
                    toastService.duration(3000).success('Отзыв', 'Отзыв создан')
                    emit('created:review');
                }

            }
        }
        emit('update:visible', false);
    };

    const deleteReview = async ()   => {

        confirm.require({
            message: 'Удалить отзыв?',
            header: 'Удаление отзыва',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                const res = await ReviewsService.deleteReview(editData.value.id);
                if(res.ok ) {
                    toastService.duration(3000).success('Отзыв', 'Отзыв удален')
                    emit('update:visible', false);
                    emit('deleted:review', editData.value.id);
                }
            },
            reject: () => {         }
        });
    }

    const updateAttach = async (files) => {
        console.log('updateAttach')
        editData.value.content = files;
        // dataUpdated.value = true;

    };
    const removeContent = (index) => {
        console.log('removeContent')
        editData.content.splice(index, 1);
    };


    // onBeforeUpdate(()=>{
    //     //todo its may be wrong
    //     editedData = reactive({...toRaw(props.editData)});
    // });


    const targetList = ref(doctorsListService.value.items());


    const saveReviewToServer = async (editedData) => {
        if(props?.editData?.id) editedData.id = props.editData.id;
        else {

            if(!editedData.reviewable_type) editedData.reviewable_type = 'doctor';
            if(!editedData.reviewable_id) editedData.reviewable_id = 3;
            editedData.tempReviewId = tempReviewId.value;
        }
        console.log('saveReviewToServer')
        return  await ReviewsService.saveReview(editedData);
    }
    const showModal = async () =>{
        // if(props?.editData?.is_new){
        //     editedData.is_new = false;
        //     await saveReview(toRaw(editedData));
        //     emit('updated:review', props.editData.id);
        // }
    }
    const dismissModal = () => {
        if(JSON.stringify(editData.value) !== JSON.stringify(props.editData)) {
            confirm.require({
                message: 'Закрыть диалог и отменить изменения?',
                header: 'Отмена',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    editData.value = {};
                    emit('update:visible', false);
                },
                reject: () => {         }
            });
        }else{ emit('update:visible', false);}
    };


</script>

<template>
    <ConfirmDialog></ConfirmDialog>
    <Dialog :visible="props.visible" modal
            :header="header"
            :style="{ width: '50vw' }"
            maximizable
            :dismissableMask="true"
            @update:visible="dismissModal"
            @show="showModal"
    >
        <div class="grid p-fluid ">
            <div class="col-12  lg:col-12">
                <div class="flex flex-wrap">
                    <div class="flex align-items-center justify-content-center m-2">
                        <InputSwitch v-model="editDataComputed.published"/>
                    </div>
                    <div class="flex align-items-center justify-content-center m-2">
                        <label >Опубликован</label>
                    </div>
                </div>

            </div>
            <div class="col-12  lg:col-12">
                <Dropdown v-model="editData.reviewable_id"
                          :options="doctorsListService.items()"
                          optionLabel="fullname"
                          optionValue="id"
                          placeholder="На кого отзыв" class="w-full md:w-14rem"
                          filter >

                </Dropdown>
            </div>

            <div class="col-12  lg:col-6 ">
                <span class="p-input-icon-left">
                    <i class="pi pi-user" />
                    <InputText type="text" v-model="editDataComputed.author"/>
                </span>
            </div>
            <div class="col-12 lg:col-6 ">
                    <InputNumber v-model="editDataComputed.rating" :min="1" :max="100" id="rating" placeholder="Рейтинг 1 до 100"/>
            </div>
            <div class="col-12">
              <AttachFiles
                      :files="editDataComputed.content"
                           @delete:content="removeContent"
                           @update:attachFiles="updateAttach"
                           :server="attachFilesServerSettings"
              >
                  <template #controlFilePanel="file">
                    <InputSwitch :modelValue="file.published" @update:modelValue="contentPublish($event, file)"/>
                  </template>
              </AttachFiles>
            </div>
            <div class="col-12">
                <Textarea v-model="editDataComputed.text" rows="5" autoResize  />
            </div>
            <div class="col-12 " :class="{'lg:col-4':(editDataComputed.id), 'lg:col-6':(!editDataComputed.id)}">
                <Button label="Сохранить" text :raised="true" @click="saveReview"/>
            </div>
            <div class="col-12" :class="{'lg:col-4':(editDataComputed.id), 'lg:col-6':(!editDataComputed.id)}">
                <Button label="Отменить" class="p-button-outlined" outlined severity="success" @click="dismissModal"/>
            </div>
            <div class="col-12  lg:col-4 " v-if="editDataComputed.id">
                <Button label="Удалить" class="p-button-outlined p-button-danger" @click="deleteReview"/>
            </div>
<!--          <div class="col-12  lg:col-6 ">-->
<!--            <img v-for="item in props.editData.content" :src="item.url">-->
<!--          </div>-->

        </div>
    </Dialog>



</template>

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
