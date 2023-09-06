
import doctorsState from '../../state/DoctorsState.js'
import doctorsApi from '../../api/DoctorsApi'


export default {
    state: doctorsState,

    //actions
    //todo set definition requestAdapter type
    async fetchServerData(requestAdapter){
        //handle data from request adapters
        if( requestAdapter )    doctorsApi.withRequestData(requestAdapter.toArray());
        if( doctorsState.requestData() )  doctorsApi.withRequestData(doctorsState.requestData());

        const res = await doctorsApi.getReviews();
        if(Object.keys(res).length > 0 && res.items){
            doctorsState.setItems(res.items);
        }
        //todo handle error
        return this;
    },


    //getters
    doctors(condition){
        if( !condition ) return this.state.getItems();
    },



}
