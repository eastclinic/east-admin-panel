

<script setup>
import { defineProps, reactive, ref, toRef, defineEmits, computed, toRaw } from 'vue'
import AttachFiles from "@/components/AttachFiles.vue";

const props = defineProps({
    visible: Boolean,
    modelValue:{default:[]}
})

const editDiplomsData = computed(() => props.modelValue)

</script>


<template>
    <Panel header="Дипломы" toggleable collapsed   >
        <template #header>
            <div class="flex align-items-center gap-2">

                <span class="font-bold">Дипломы</span>
            </div>
        </template>
        <template #icons v-if="editDiplomsData && editDiplomsData.length > 0">
            <Badge :value="editDiplomsData.length"  class="ml-auto" />
        </template>
            <DataTable
                    v-model:expandedRows="editDiplomsData"
                    :value="editDiplomsData"
                    dataKey="id"
                    @rowExpand="onRowExpand"
                    @rowCollapse="onRowCollapse"
                    tableStyle="min-width: 60rem"
            >
                <template #header>
                    <div class="flex flex-wrap justify-content-end gap-2">

                    </div>
                </template>
                <Column expander style="width: 5rem" />
                <Column field="title" header="title" ></Column>

                <Column field="price" header="Price">
                    <template #body="slotProps" v-if="slotProps?.data?.content?.length > 0">
                        <Badge :value="slotProps.data.content.length"  class="ml-auto" />
                    </template>
                </Column>
                <template #expansion="slotProps" >
                    <div class="p-3">
                        {{slotProps}}
                        <AttachFiles
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
                </template>
            </DataTable>


<!--        <AttachFiles-->
<!--                v-model:files="editedData.content"-->
<!--                v-model:upload="uploadContent"-->
<!--                targetType="doctor"-->
<!--                :targetId="editedData.id"-->
<!--        >-->
<!--            &lt;!&ndash;                <template #controlFilePanel="file">&ndash;&gt;-->
<!--            &lt;!&ndash;                    <InputSwitch :modelValue="file.published" @update:modelValue="contentPublish($event, file)"/>&ndash;&gt;-->
<!--            &lt;!&ndash;                </template>&ndash;&gt;-->
<!--        </AttachFiles>-->

    </Panel>

</template>

<style scoped>

</style>