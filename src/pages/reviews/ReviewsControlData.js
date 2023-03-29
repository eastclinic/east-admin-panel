
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import CustomerService from '@/services/CustomerService';
import ReviewsService from "../../services/Reviews/ReviewsService";
import request from "../../api/apiRequestAdapters/DataTableRequestAdapter";

import { ref } from 'vue';
import { useLayout } from '@/layout/composables/layout';

export const { contextPath } = useLayout();




export  const customer1 = ref(null);
export const filters1 = ref(null);
export const loading1 = ref(null);
export const visibleEditDialog = ref(false);


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
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
};

export const clearFilter1 = () => {
    initFilters1();
};


export const formatDate = (value) => {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
export const onPage = async (e) =>{
    await fetchServerData(request.page(e.page+1).perPage(countRows));
}

export const onOpenEdit = async (e) =>{
    console.log('onOpenEdit')
    console.log(e.data.text)
    visibleEditDialog.value = true;
}

const fetchServerData = async (requestApi) =>{
    return reviewsService.fetchServerData(requestApi);
}


