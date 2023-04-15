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
    import DoctorsInfoService from "@/services/Doctors/DoctorsInfoService";
    const props = defineProps({
        visible: Boolean,
        editData:Object
    })
    const emit = defineEmits(['update:visible', 'update:review'])
    const editedData = props.editData;

    const header = ref((Object.keys(props.editData).length > 0) ? 'Редактирование доктора' : 'Создание нового доктора')
    const doctorsInfoService = DoctorsInfoService;

    const dismissModal = () => emit('update:visible', false)
    const saveReview = async () => {
        if(props?.editData?.id) editedData.id = props.editData.id;
        const res = await doctorsInfoService.saveReview(editedData);
        if(res.ok ) dismissModal();
        //todo refresh row from server
        emit('update:review', props.editData.id);
    }


</script>

<style scoped>

</style>
