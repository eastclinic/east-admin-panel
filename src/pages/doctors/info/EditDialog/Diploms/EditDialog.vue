<script setup>
import { defineProps, reactive, ref, toRef, defineEmits, computed, toRaw } from 'vue'
import AttachFiles from "@/components/AttachFiles.vue";
const props = defineProps({
    visible: Boolean,
    modelValue:Object
})

let uploadContent = ref(false);
const editedData = computed(() => props.modelValue);

const header = computed(() => (Object.keys(props.modelValue).length > 0) ? 'Редактирование диплома' : 'Создание нового диплома')


const dismissModal = () => emit('update:visible', false)


</script>

<template>
    <Dialog :visible="props.visible" modal :header="header" :style="{ width: '50vw' }" maximizable :dismissableMask="true"  @update:visible="emit('update:visible', $event)">
        <div class="grid p-fluid">
            <div class="col-12  lg:col-12 ">
                <InputText type="text" v-model:modelValue="editedData.title" placeholder="Title"/>
            </div>

            <div class="col-12">

            </div>
            <div class="col-12  lg:col-12 ">
                <AttachFiles
                        v-if="editedData.id"
                        v-model:files="editedData.content"
                        v-model:upload="uploadContent"
                        targetType="doctor"
                        :targetId="editedData.id"
                >
                    <!--                <template #controlFilePanel="file">-->
                    <!--                    <InputSwitch :modelValue="file.published" @update:modelValue="contentPublish($event, file)"/>-->
                    <!--                </template>-->
                </AttachFiles>
            </div>
            <div class="col-12  lg:col-6 ">
                <Button :disabled="uploadContent"  label="Сохранить" text :raised="true" @click="saveItemData"/>
            </div>
            <div class="col-12  lg:col-6 ">
                <Button label="Отмена" class="p-button-outlined" outlined severity="success" @click="dismissModal"/>
            </div>
        </div>
    </Dialog>



</template>



<style scoped>

</style>
