import {BASE_URL} from '@/services/config';

export default class ProductService {
    getReviews() {
        return fetch(BASE_URL + '/api/reviews')
            .then((res) => res.json())
            .then((d) => d.items);
    }

    // getProducts() {
    //     return fetch(contextPath + 'demo/data/products.json')
    //         .then((res) => res.json())
    //         .then((d) => d.data);
    // }
    //
    // getProductsWithOrdersSmall() {
    //     return fetch(contextPath + 'demo/data/products-orders-small.json')
    //         .then((res) => res.json())
    //         .then((d) => d.data);
    // }
}
