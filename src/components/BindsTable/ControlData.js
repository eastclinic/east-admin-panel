import {defineProps, ref, onMounted} from "vue";
export default {
    setup(props){



        const colData = ref([
            {id:1, text:'Абраменко А А'},
            {id:2, text:'Хайдзан Чао'},
            {id:3, text:'Митрофанов'},
            {id:4, text:'Денисов'},
            {id:5, text:'Симачевский'},
        ]);
        const rowData = ref([
            {id:1, text:'Консультация психолога'},
            {id:2, text:'Остеопатия'},
            {id:3, text:'Консультация врача первичного приема'},
            {id:4, text:'Консультация невролога'},
            {id:5, text:'Консультация вертебролога'},
        ]);
        console.log(props)

        const bindsData = ref({
            1:{  1:{id:1, unit:1, tag:1},   4:{id:14, unit:1, tag:4}, },
            2:{
                2:{id:1, unit:2, tag:2},
                3:{id:14, unit:2, tag:3},
                4:{id:14, unit:2, tag:4},
            },
            3:{  1:{id:1, unit:3, tag:1},  2:{id:14, unit:3, tag:2}, 4:{id:1, unit:3, tag:4}, 7:{id:1, unit:3, tag:7}},
            4:{
                2:{id:1, unit:4, tag:2},
                3:{id:1, unit:4, tag:3},
                7:{id:14, unit:4, tag:7},

            },
            5:{   5:{id:14, unit:5, tag:5}, },
        });


        return {colData, rowData, bindsData}
    }

}