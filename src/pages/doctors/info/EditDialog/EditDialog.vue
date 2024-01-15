<script setup>
import { defineProps, reactive, ref, toRef, defineEmits, computed, toRaw, watchEffect } from 'vue'

import doctorsInfoService from "@/services/Doctors/DoctorsInfoService";
import AttachFiles from "@/components/AttachFiles/AttachFiles.vue";
import Diploms from "@/pages/doctors/info/EditDialog/Diploms/Diploms.vue";
import toastService from '@/services/Toast'

const props = defineProps({
    visible: Boolean,
    editData:Object
})

let uploadContent = ref(false);
const emit = defineEmits(['update:visible', 'update', 'updated'])
const editData = ref(null);

watchEffect(() => {
    if (props.visible && !editData.value)  editData.value = JSON.parse(JSON.stringify(props.editData));
    if (!props.visible) editData.value = null;
});

const header = computed(() => (props.editData && Object.keys(props.editData).length > 0) ? 'Редактирование доктора' : 'Создание нового доктора')


const dismissModal = (isVisible) => {
    if(JSON.stringify(editData.value) !== JSON.stringify(props.editData)){
        const cancelChange = confirm("Данные доктора изменены, выйти без сохранения?");
        if(cancelChange) {
            emit('update:visible', false);
        }else {
            return false;
        }
    }
    emit('update:visible', isVisible)
    return true;
}
const saveItemData = async () => {
    if(JSON.stringify(editData.value) !== JSON.stringify(props.editData)){
        if(props?.editData?.id) editData.id = props.editData.id;
        const res = await doctorsInfoService.save(toRaw(editData.value));
        if(res.ok && res.message) toastService.success(res.message);;
        emit('updated', props.editData.id);
    }
    emit('update:visible', false)

}


const updated = () => {
    console.log('updated')
    emit('updated', props.editData.id);
}


</script>

<template>
    <Dialog :visible="props.visible" modal :header="header" :style="{ width: '50vw' }" maximizable :dismissableMask="true"  @update:visible="dismissModal">
        <div class="grid p-fluid">
            <div class="col-12  lg:col-4 ">
                <InputText type="text" v-model:modelValue="editData.surname" placeholder="Фамилия"/>
            </div>
            <div class="col-12 lg:col-4 ">
                <InputText id="name" type="text" v-model:modelValue="editData.name"  placeholder="Имя"/>
            </div>
            <div class="col-12 lg:col-4 ">
                <InputText id="middlename" type="text" v-model:modelValue="editData.middlename" placeholder="Отчество"/>
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
                <template #icons v-if="editData.contentOriginal && editData.contentOriginal.length > 0">
                    <Badge :value="editData.contentOriginal.length"  class="ml-auto" />
                </template>
                <AttachFiles
                        v-if="editData.id"
                        v-model:files="editData.contentOriginal"
                        v-model:upload="uploadContent"
                        targetType="doctor"
                        :targetId="editData.id"
                >
                    <!--                <template #controlFilePanel="file">-->
                    <!--                    <InputSwitch :modelValue="file.published" @update:modelValue="contentPublish($event, file)"/>-->
                    <!--                </template>-->
                </AttachFiles>

            </Panel>
                <Diploms v-model="editData.diplomsOriginal" :doctor_id="editData.id" @updated="updated"></Diploms>
            </div>
            <div class="col-12  lg:col-6 ">
                <Button :disabled="uploadContent"  label="Сохранить" text :raised="true" @click="saveItemData"/>
            </div>
            <div class="col-12  lg:col-6 ">
                <Button label="Отмена" class="p-button-outlined" outlined severity="success" @click="dismissModal(false)"/>
            </div>
        </div>
    </Dialog>



</template>



<style scoped>

</style>
