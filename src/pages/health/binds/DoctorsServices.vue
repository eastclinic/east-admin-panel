

<script setup>
    import doctorsService from "@/services/Doctors/DoctorsInfoService";

    import BindsTable from "@/components/BindsTable/Control.vue";

</script>

<template>
    <BindsTable
            :columnsService="doctorsService"
            :rowsService="doctorsService"
    ></BindsTable>
</template>


<style scoped>

</style>