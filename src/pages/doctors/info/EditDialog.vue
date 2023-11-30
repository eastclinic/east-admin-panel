<script setup>
import { defineProps, reactive, ref, toRef, defineEmits, computed, toRaw } from 'vue'
import doctorsInfoService from "@/services/Doctors/DoctorsInfoService";
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


const dismissModal = () => emit('update:visible', false)
const saveItemData = async () => {
    if(props?.editData?.id) editedData.id = props.editData.id;
    const res = await doctorsInfoService.save(toRaw(editedData.value));
    if(res.ok ) dismissModal();
    //todo refresh row from server
    emit('updated', props.editData.id);
}

const updateAttach = async (files) => {
    console.log('updateAttach')
    uploadContent.value=false;
    editedData.value.content = files;
    // dataUpdated.value = true;

};



</script>

<template>
    <Dialog :visible="props.visible" modal :header="header" :style="{ width: '50vw' }" maximizable :dismissableMask="true"  @update:visible="emit('update:visible', $event)">
        <div class="grid p-fluid">
            <div class="col-12  lg:col-4 ">
                <InputText type="text" v-model:modelValue="editedData.surname" placeholder="Фамилия"/>
            </div>
            <div class="col-12 lg:col-4 ">
                <InputText id="name" type="text" v-model:modelValue="editedData.name"  placeholder="Имя"/>
            </div>
            <div class="col-12 lg:col-4 ">
                <InputText id="middlename" type="text" v-model:modelValue="editedData.middlename" placeholder="Отчество"/>
            </div>
            <div class="col-12">
            <AttachFiles
                :files="editedData.content"
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

            <div class="col-12  lg:col-6 ">
                <Button label="Сохранить" text :raised="true" @click="saveItemData"/>
            </div>
            <div class="col-12  lg:col-6 ">
                <Button label="Отмена" class="p-button-outlined" outlined severity="success" @click="dismissModal"/>
            </div>
        </div>
    </Dialog>



</template>



<style scoped>

</style>
