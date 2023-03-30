
import reviewsState from '../../state/ReviewsState.js'
import reviewsApi from '../../api/ReviewsApi'


export default {
    state: reviewsState,

    //actions
    //todo set definition requestAdapter type
    async fetchServerData(requestAdapter){
        //handle data from request adapters

        if( requestAdapter )    reviewsApi.withRequestData(requestAdapter.toArray());
        if( reviewsState.requestData() )  reviewsApi.withRequestData(reviewsState.requestData());

        const res = await reviewsApi.getReviews();
        if(Object.keys(res).length > 0 && res.items){
            reviewsState.setItems(res.items);
        }

        reviewsState.setCount(res.count);

        //todo handle error
        return this;
    },


    async saveReview( data ){
        return  await reviewsApi.saveReview(data);
    },

    //getters
    reviews(condition){
        if( !condition ) return this.state.getItems();
    },

    count(){   return this.state.count();  }

}
