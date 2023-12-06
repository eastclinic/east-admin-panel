<script setup>
import { defineProps, reactive, ref, toRef, defineEmits, computed, toRaw } from 'vue'
import AttachFiles from "@/components/AttachFiles.vue";
import doctorDiplomsService from "@/services/Doctors/DoctorsDiplomsService";
import toastService from '@/services/Toast'


const props = defineProps({
    visible: Boolean,
    modelValue:Object,
    doctor_id:{        required:true, type:Number   }
})
const emit = defineEmits(['update:visible', 'updated', 'update:modelValue']);
let uploadContent = ref(false);
const editedData = computed(() => props.modelValue);

const header = computed(() => (Object.keys(props.modelValue).length > 0) ? 'Редактирование диплома' : 'Создание нового диплома')


const dismissModal = () => emit('update:visible', false)
const saveItemData = async () => {
    const saveData = JSON.parse(JSON.stringify(editedData.value));
    saveData.doctor_id = props.doctor_id;
    const res = await doctorDiplomsService.save( saveData );

    if(res.data ) {

        dismissModal();
        if(editedData.value.id){
            emit('updated', editedData.value.id);
        }

        toastService.success('Диплом', 'Диплом сохранен')
    } else {
        toastService.error('Диплом', 'Ошибка сохранения диплома')
    }


}



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
                        targetType="doctorDiplom"
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
