<script setup>
import { defineProps, reactive, ref, toRef, defineEmits, computed } from 'vue'
import DoctorsInfoService from "@/services/Doctors/DoctorsInfoService";
import AttachFiles from "@/components/AttachFiles.vue";
const props = defineProps({
    visible: Boolean,
    editData:Object
})

let uploadContent = ref(false);
const emit = defineEmits(['update:visible', 'update', 'updated'])
// const editedData = ref(props.editData);
const editedData = computed(() => props.editData);

const header = computed(() => (Object.keys(props.editData).length > 0) ? 'Редактирование доктора' : 'Создание нового доктора')
const doctorsInfoService = DoctorsInfoService;

const dismissModal = () => emit('update:visible', false)
const saveReview = async () => {
    if(props?.editData?.id) editedData.id = props.editData.id;
    const res = await doctorsInfoService.saveReview(editedData);
    if(res.ok ) dismissModal();
    //todo refresh row from server
    emit('update:review', props.editData.id);
}

const updateAttach = async (files) => {
    console.log('updateAttach')
    uploadContent.value=false;
    editData.value.content = files;
    // dataUpdated.value = true;

};



</script>

<template>
    <Dialog :visible="props.visible" modal :header="header" :style="{ width: '50vw' }" maximizable :dismissableMask="true"  @update:visible="emit('update:visible', $event)">
        <div class="grid p-fluid">
            <div class="col-12  lg:col-6 ">
                <span class="p-input-icon-left">
                    <i class="pi pi-user" />
                    <InputText type="text" :value="props.editData.author" @update:modelValue="editedData.author =$event" />
                </span>
            </div>
            <div class="col-12 lg:col-6 ">
                   <span class="p-float-label">
                    <InputText id="username" type="text" :value="props.editData.author"  @update:modelValue="editedData.author =$event"/>
                    <label for="username">Username</label>
                </span>
            </div>
            <div class="col-12">
                {{editedData}}
            <AttachFiles
                :files="editedData.content"
                ref="content"
                targetType="doctor"
                :targetId="editedData.id"
                @update:content="updateAttach"
                @updating:content="uploadContent=true"
            >
<!--                <template #controlFilePanel="file">-->
<!--                    <InputSwitch :modelValue="file.published" @update:modelValue="contentPublish($event, file)"/>-->
<!--                </template>-->
            </AttachFiles>
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



<style scoped>

</style>
