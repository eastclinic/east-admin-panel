
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import CustomerService from '@/services/CustomerService';
import ReviewsService from "../../services/Reviews/ReviewsService";

import { ref, onBeforeMount } from 'vue';
import { useLayout } from '@/layout/composables/layout';

export const { contextPath } = useLayout();

export const reviews = ref(null);


export  const customer1 = ref(null);
export const filters1 = ref(null);
export const loading1 = ref(null);

export const statuses = ref(['unqualified', 'qualified', 'new', 'negotiation', 'renewal', 'proposal']);
export const representatives = ref([]);

export const customerService = new CustomerService();

export const reviewsService = ReviewsService;



export const onBeforeMountHook = () => async () => {


    await reviewsService.fetchServerData();
    reviews.value = reviewsService.reviews();

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


// const formatCurrency = (value) => {
//     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
// };

export const formatDate = (value) => {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

