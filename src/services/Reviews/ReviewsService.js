
import reviewsState from '../../state/ReviewsState.js'
import reviewsApi from '../../api/ReviewsApi'

// export reviews2(condition){
//     if( !condition ) return this.state.getItems();
// }




export default {
    state: reviewsState,
    //todo set definition requestAdapter type
    async fetchServerData(requestAdapter){
        //handle data from request adapters
        if( requestAdapter )    reviewsApi.withRequestData(requestAdapter.toArray());
        if( reviewsState.requestData() )  reviewsApi.withRequestData(reviewsState.requestData());

        const res = await reviewsApi.withRequestData(reviewsState.requestData()).getReviews();
        if(Object.keys(res).length > 0 && res.items){
            reviewsState.setItems(res.items);
        }
        //todo handle error
        return this;
    },
    reviews(condition){
        if( !condition ) return this.state.getItems();
    },



}
