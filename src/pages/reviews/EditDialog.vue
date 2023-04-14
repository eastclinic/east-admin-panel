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
                        <InputSwitch  :value="props.editData.published" @update:modelValue="editedData.published =$event" />
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

            <div class="col-12">
                <Textarea v-model="editedData.text" rows="5" autoResize  />
            </div>
            <div class="col-12  lg:col-6 ">
                <Button label="Сохранить" text :raised="true" @click="updateReview"/>
            </div>
            <div class="col-12  lg:col-6 ">
                <Button label="Отмена" class="p-button-outlined" outlined severity="success" @click="emit('update:visible', false)"/>
            </div>
        </div>
    </Dialog>



</template>

<script setup>
    import { defineProps, reactive, ref, toRefs, defineEmits, computed, toRaw, onBeforeUpdate  } from 'vue'
    import ReviewsService from "../../services/Reviews/ReviewsService";
    const props = defineProps({
        visible: Boolean,
        editData:Object
    })
    const emit = defineEmits(['update:visible', 'updated:review', 'created:review'])
    let  editedData = reactive(props.editData);
    const header = computed(() => (props.editData?.id) ? 'Редактирование отзыва' : 'Создание нового отзыва');
    const reviewsService = ReviewsService;

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
    }
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

        return  await reviewsService.saveReview(editedData);
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

</style>
