<template>
    <Dialog :visible="props.visible" modal :header="header" :style="{ width: '50vw' }" maximizable :dismissableMask="true"  @update:visible="emit('update:visible', $event)" @show="reviewNotNew">
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
                <Textarea v-model="props.editData.text" @update:modelValue="editedData.text =$event" rows="5" autoResize  />
            </div>
            <div class="col-12  lg:col-6 ">
                <Button label="Сохранить" text :raised="true" @click="updateReview"/>
            </div>
            <div class="col-12  lg:col-6 ">
                <Button label="Отмена" class="p-button-outlined" outlined severity="success" @click="dismissModal"/>
            </div>
        </div>
    </Dialog>



</template>

<script setup>
    import { defineProps, reactive, ref, toRefs, defineEmits, computed, toRaw } from 'vue'
    import ReviewsService from "../../services/Reviews/ReviewsService";
    const props = defineProps({
        visible: Boolean,
        editData:Object
    })
    const emit = defineEmits(['update:visible', 'update:review', 'create:review'])
    const editedData = props.editData;

    const header = computed(() => (props.editData?.id) ? 'Редактирование отзыва' : 'Создание нового отзыва');
    const reviewsService = ReviewsService;

    const dismissModal = () => emit('update:visible', false)
    const updateReview = async () => {
        const res = await saveReview(toRaw(editedData));

        emit('create:review', props.editData.id);
        if(res.ok ) dismissModal();
    }

    const saveReview = async (editedData) => {
        if(props?.editData?.id) editedData.id = props.editData.id;
        return  await reviewsService.saveReview(editedData);
    }
    const reviewNotNew = async () =>{
        if(props?.editData?.is_new){
            editedData.is_new = false;
            await saveReview(toRaw(editedData));
            emit('update:review', props.editData.id);
        }
    }


</script>

<style scoped>

</style>
