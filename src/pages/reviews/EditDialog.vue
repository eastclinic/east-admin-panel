<template>
    <Dialog :visible="props.visible" modal :header="header" :style="{ width: '50vw' }" maximizable :dismissableMask="true"  @update:visible="emit('update:visible', $event)">
        <div class="grid p-fluid ">
            <div class="col-12  lg:col-12">
                <div class="flex flex-wrap">
                    <div class="flex align-items-center justify-content-center m-2">
                        <InputSwitch  v-model="props.editData.published" @update:modelValue="editedData.published =$event" />
                    </div>
                    <div class="flex align-items-center justify-content-center m-2">
                        <label >Опубликован</label>
                    </div>
                </div>


        </div>
            <div class="col-12  lg:col-6 ">
                <span class="p-input-icon-left">
                    <i class="pi pi-user" />
                    <InputText type="text" :value="props.editData.author" @update:modelValue="editedData.author =$event" />
                </span>
            </div>
            <div class="col-12 lg:col-6 ">
                   <span class="p-input-icon-left">
                       <i class="pi pi-star" />
                    <InputText type="text" :value="props.editData.rating"  @update:modelValue="editedData.rating =$event"/>
                </span>
            </div>

            <div class="col-12">
                <Editor v-model="props.editData.text"  @update:modelValue="editedData.text =$event" editorStyle="min-height: 240px" />
            </div>
            <div class="col-12  lg:col-6 ">
                <Button label="Сохранить" text :raised="true" @click="saveReview"/>
            </div>
            <div class="col-12  lg:col-6 ">
                <Button label="Отмена" class="p-button-outlined" outlined severity="success" @click="dismissModal"/>
            </div>
        </div>
    </Dialog>



</template>

<script setup>
    import { defineProps, reactive, ref, toRef, defineEmits } from 'vue'
    import ReviewsService from "../../services/Reviews/ReviewsService";
    const props = defineProps({
        visible: Boolean,
        editData:Object
    })
    const emit = defineEmits(['update:visible', 'update:review'])
    const editedData = props.editData;

    const header = ref((Object.keys(props.editData).length > 0) ? 'Редактирование отзыва' : 'Создание нового отзыва')
    const reviewsService = ReviewsService;

    const dismissModal = () => emit('update:visible', false)
    const saveReview = async () => {
        if(props?.editData?.id) editedData.id = props.editData.id;
        const res = await reviewsService.saveReview(editedData);
        if(res.ok ) dismissModal();
        //todo refresh row from server
        emit('update:review', props.editData.id);
    }


</script>

<style scoped>

</style>
