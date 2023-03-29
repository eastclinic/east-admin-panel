<template>
    <Dialog :visible="props.visible" modal header="Header" :style="{ width: '50vw' }" :dismissableMask="true"  @update:visible="emit('update:visible', $event)">

    </Dialog>
</template>

<script setup>
    import { defineProps, reactive, ref, toRef, defineEmits } from 'vue'
    const props = defineProps({
        visible: Boolean
    })
    const emit = defineEmits(['update:visible'])




</script>

<style scoped>

</style>
