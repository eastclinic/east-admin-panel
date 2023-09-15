<template>
<div>
    <slot v-bind="items">
        {{optionValue}}
        <Dropdown v-model="selectedItems"
                  :options="items"
                  optionLabel="name"
                  :optionLabel="optionLabel"
                  :optionValue="optionValue"
                  placeholder="Select a City" class="w-full md:w-14rem" />

    </slot>
</div>
</template>

<script setup>
    import {defineEmits, defineProps, reactive, ref, toRaw, watch, computed, onMounted} from 'vue';
    import ListRequestAdapter from "@/api/apiRequestAdapters/ListRequestAdapter";
    import Api from "@/api/TargetListApi";

const props = defineProps({
    modelValue:Object,
    options:Array,
    optionLabel:String,
    optionValue:String,
    service:Object,
});

    // const items = ref(props.options);
    const selectedItems = ref(props.modelValue);
    const optionLabel = ref(props.optionLabel);
    const optionValue = ref(props.optionValue);
    const Service = ref(props.service);
    const items = ref(Service.value.items());


</script>

<style scoped>

</style>
