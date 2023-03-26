
import { reactive, provide, inject, readonly } from 'vue';
import reviewsState from '../../state/ReviewsState.js'
import reviewsApi from '../../api/ReviewsApi'

export default {
    state: reviewsState,
    _cash: reactive({}),

    async getReviews(){
        const res = await reviewsApi.getReviews();
        if(Object.keys(res).length > 0 && res.items){
            reviewsState.setItems(res.items);
        }
        window.s = {...this.state};
    },



}
