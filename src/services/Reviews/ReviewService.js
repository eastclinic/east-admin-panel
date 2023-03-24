import baseUrl from '@/services/config.js';
import { reactive, provide, inject, readonly } from 'vue';
import { each } from '@vueuse/core';


export default class ReviewService {
    state = reactive({});
    _cash = reactive({});

    async getReviews() {
        const res = await fetch(baseUrl+'/api/reviews')
        const data = await res.json()
        console.log(data)
        if(!data) console.log('no reviews')
        if(data.items)this.setCashItems(data.items)
    }


    setCashItems(items){

        each(items, (v, i) => {if( v && i)this._cash[i] = v});
    }






}
