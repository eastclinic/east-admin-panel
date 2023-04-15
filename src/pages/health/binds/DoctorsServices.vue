

<script setup>
    import doctorsService from "@/services/Doctors/DoctorsInfoService";
    import healthRootService from "@/services/Health/HealthRootService";

    import BindsTable from "@/components/BindsTable/Control.vue";

</script>

<template>
    <BindsTable
            :columnsService="doctorsService"
            :rowsService="healthRootService"
    ></BindsTable>
</template>


<style scoped>

</style>