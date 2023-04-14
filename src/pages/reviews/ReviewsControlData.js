
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import CustomerService from '@/services/CustomerService';
import ReviewsService from "../../services/Reviews/ReviewsService";
import dataTableRequestAdapter from "../../api/apiRequestAdapters/DataTableRequestAdapter";

import { ref, reactive } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import reviewsState from "../../state/ReviewsState";

export const { contextPath } = useLayout();


const dtRequest = dataTableRequestAdapter;

export  const customer1 = ref(null);
export const filters1 = ref(null);
export const loading1 = ref(null);
export const visibleEditDialog = ref(false);
export let editData = {};


export const statuses = ref(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);
export const representatives = ref([]);

export const customerService = new CustomerService();

const reviewsService = ReviewsService;
export const reviews = reviewsService.reviews();
export const count = reviewsService.count();
export const countRows = 10;




export const onBeforeMountHook = () => async () => {
    await reviewsService.fetchServerData();
    customerService.getCustomersLarge().then((data) => {
        customer1.value = data;
        loading1.value = false;
        customer1.value.forEach((customer) => (customer.date = new Date(customer.date)));
    });



};


export const onBeforeMountInitFilters = () => () => {
    initFilters1();
};



export const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: [0, 50], matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS },
        published: { value: null, matchMode: FilterMatchMode.EQUALS },
        author: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        created_at: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        rating: { value: null, matchMode: FilterMatchMode.EQUALS },
    };
};

export const clearFilter1 = () => {
    initFilters1();
};


export const formatDate = (timestamp) => {
    if(timestamp){
        const date = new Date(timestamp * 1000); // умножаем на 1000, чтобы получить миллисекунды
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            timeZone: 'Europe/Moscow'
        });
    }
    return timestamp;
};
export const onPage = async (e) =>{
    await reviewsService.fetchServerData(dtRequest.dtEvent(e).requestData());
}

export const onOpenEdit = async (e) =>{
    visibleEditDialog.value = true;
    editData = {...e.data};
}


export const refreshReviewRow = async (id) =>{
    await reviewsService.fetchServerData({ id:id });
}
export const refreshReviews = async () =>{
   await reviewsService.fetchServerData(dtRequest.data());
}


export const createItem =  (e) =>{
    visibleEditDialog.value = true;
    editData = {};
}

export const onSort = async (event) =>{
    //todo now not work multisort(
    dtRequest.dtEvent(event);
    await refreshReviews();
}
export const onFilter = async (e) => {
    dtRequest.dtEvent(e);
    console.log(e)
    await refreshReviews();
};

export const rating5 =  (rating) =>{
    return rating / 20;
}

export const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'country.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS }
});
