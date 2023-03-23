import baseUrl from '@/services/config.js';
import { reactive, provide, inject, readonly } from 'vue';


export default class ReviewService {
    state = reactive({});

    getReviews() {
        console.log(baseUrl)
        return fetch('http://127.0.0.1/api/reviews')
            .then((res) => {
                console.log(res)
                res.json()
            })
            .then((d) => d.items);
    }







}
