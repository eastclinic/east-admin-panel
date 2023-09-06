<template>
<div>
    <slot v-bind="items">
        {{items}}
        {{optionValue}}
        <Dropdown v-model="selectedItems"
                  :options="cities"
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
    url:String,
    optionLabel:String,
    optionValue:String,
    service:Object,
});

// const items = ref(props.options);
const items = ref([]);
const selectedItems = ref(props.modelValue);
const optionLabel = ref(props.optionLabel);
const optionValue = ref(props.optionValue);

    const cities = ref([
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ]);

    onMounted(async ()=>{
        if(props.url){
            console.log(props.url)
            const res = await Api.fetchServerData(props.url, ListRequestAdapter.page(1).requestData());

            if(res.items){
                items.value = res.items;
                if(res.optionLabel) optionLabel.value = res.optionLabel;
                if(res.optionValue) optionValue.value = res.optionValue;

                console.log(optionValue.value)
                console.log(optionLabel.value)
            }
        }
    });


</script>

<style scoped>

</style>
