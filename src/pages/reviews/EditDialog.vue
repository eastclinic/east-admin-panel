<template>
    <Dialog :visible="props.visible" modal :header="header" :style="{ width: '50vw' }" maximizable :dismissableMask="true"  @update:visible="emit('update:visible', $event)">

        <div class="grid p-fluid">
            <div class="col-12  lg:col-6 ">
                        <span class="p-input-icon-left">
                            <i class="pi pi-user" />
                            <InputText type="text" v-model="props.editData.author" />
                        </span>
            </div>
            <div class="col-12 lg:col-6 ">
                   <span class="p-float-label">
                    <InputText id="username" type="text" v-model="props.editData.author" />
                    <label for="username">Username</label>
                </span>
            </div>

            <div class="col-12">
                <Editor v-model="props.editData.text" editorStyle="min-height: 240px" />
            </div>
            <div class="col-12  lg:col-6 ">
                <Button label="Сохранить" text :raised="true" />
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
    const emit = defineEmits(['update:visible'])

    const header = ref((Object.keys(props.editData).length > 0) ? 'Редактирование отзыва' : 'Создание нового отзыва')
    const reviewsService = ReviewsService;

    const dismissModal = () => emit('update:visible', false)

</script>

<style scoped>

</style>
