
import reviewsState from '../../state/ReviewsState.js'
import reviewsApi from '../../api/ReviewsApi'

export default {
    state: reviewsState,
    async fetchServer(){
        const res = await reviewsApi.getReviews();
        if(Object.keys(res).length > 0 && res.items){
            reviewsState.setItems(res.items);
        }
        return this;
    },
    reviews(condition){
        if( !condition ) return this.state.getItems();
    },



}
