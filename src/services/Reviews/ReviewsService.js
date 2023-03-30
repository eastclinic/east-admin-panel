
import reviewsState from '../../state/ReviewsState.js'
import reviewsApi from '../../api/ReviewsApi'


export default (() =>({
    state: reviewsState,
    requestData:{},

    //actions
    //todo set definition requestAdapter type
    async fetchServerData(requestData){
        //handle data from request adapters
        requestData = (requestData) ? requestData : {};

        if( reviewsState.requestData() )  requestData = { ...requestData, ...reviewsState.requestData() };

        const res = await reviewsApi.getReviews(requestData);
        if(Object.keys(res).length > 0 && res.items){
            reviewsState.setItems(res.items);
        }
        if(Object.keys(res).length > 0 && res.itemsUpdated){
            reviewsState.refreshItems(res.itemsUpdated);
        }

        reviewsState.setCount(res.count);

        //todo handle error
        return true;
    },


    async saveReview( data ){
        return  await reviewsApi.saveReview(data);
    },

    //getters
    reviews(condition){
        if( !condition ) return this.state.getItems();
    },

    count(){   return this.state.count();  },

}))();
