<script setup>
import { defineProps, reactive, ref, toRef, defineEmits, computed, toRaw } from 'vue'

import doctorsInfoService from "@/services/Doctors/DoctorsInfoService";
import AttachFiles from "@/components/AttachFiles/AttachFiles.vue";
import Diploms from "@/pages/doctors/info/EditDialog/Diploms/Diploms.vue";


const props = defineProps({
    visible: Boolean,
    editData:Object
})

let uploadContent = ref(false);
const emit = defineEmits(['update:visible', 'update', 'updated'])
const editedData = computed(() => JSON.parse(JSON.stringify(props.editData)));

const header = computed(() => (props.editData && Object.keys(props.editData).length > 0) ? 'Редактирование доктора' : 'Создание нового доктора')


const dismissModal = () => {

    if(JSON.stringify(editedData.value) !== JSON.stringify(props.editData)){
        const cancelChange = confirm("Данные доктора изменены, выйти без сохранения?");
        if(cancelChange) {
            emit('update:visible', false)
        }else {
            return false;
        }
    }
    return false;
}
const saveItemData = async () => {
    if(props?.editData?.id) editedData.id = props.editData.id;
    const res = await doctorsInfoService.save(toRaw(editedData.value));
    if(res.ok ) dismissModal();
    emit('updated', props.editData.id);
}

const onChangeVisible = (isVisible) => {
    if(JSON.stringify(editedData.value) !== JSON.stringify(props.editData)){
        return false;
    }

    emit('update:visible', isVisible)
    return true;
}

const updated = () => {
    console.log('updated')
    emit('updated', props.editData.id);
}

const visibleDiplomsDialog = ref(false);


</script>

<template>

    <Dialog :visible="props.visible" modal :header="header" :style="{ width: '50vw' }" maximizable :dismissableMask="true"  @update:visible="onChangeVisible">

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

            </div>
            <div class="col-12  lg:col-12 ">
            <Panel header="Контент" toggleable collapsed   >
                <template #header>
                    <div class="flex align-items-center gap-2">

                        <span class="font-bold">Контент</span>
                    </div>
                </template>
                <template #icons v-if="editedData.contentOriginal && editedData.contentOriginal.length > 0">
                    <Badge :value="editedData.contentOriginal.length"  class="ml-auto" />
                </template>
                <AttachFiles
                        v-if="editedData.id"
                        v-model:files="editedData.contentOriginal"
                        v-model:upload="uploadContent"
                        targetType="doctor"
                        :targetId="editedData.id"
                >
                    <!--                <template #controlFilePanel="file">-->
                    <!--                    <InputSwitch :modelValue="file.published" @update:modelValue="contentPublish($event, file)"/>-->
                    <!--                </template>-->
                </AttachFiles>

            </Panel>
                <Diploms v-model="editedData.diplomsOriginal" :doctor_id="editedData.id" @updated="updated"></Diploms>
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
