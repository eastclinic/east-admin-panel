<template>
<div>
    <slot v-bind="items">
        <Dropdown v-model="selectedItems" :options="items" optionLabel="name" placeholder="Select a City" class="w-full md:w-14rem" />

    </slot>
</div>
</template>

<script setup>
    import {defineEmits, defineProps, reactive, ref, toRaw, watch, computed} from 'vue';
    import ListRequestAdapter from "@/api/apiRequestAdapters/ListRequestAdapter";
    import Api from "@/api/TargetListApi";

const props = defineProps({
    modelValue:Object,
    options:Object,
    url:String
});

// const items = ref(props.options);
const items = ref({id:1, name:'sdfwef wfefwef'});
const selectedItems = ref(props.modelValue);

if(props.url){
    console.log(props.url)
    const res = await Api.fetchServerData(props.url, ListRequestAdapter.page(1).requestData());

    if(res.items){
        items.value = res.items;
    }
}

</script>

<style scoped>

</style>
