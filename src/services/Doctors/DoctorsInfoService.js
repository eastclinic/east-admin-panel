import {toRaw, ref, computed} from "vue";
import doctorsState from '../../state/DoctorsState.js'
import doctorsApi from '../../api/DoctorsApi'


export default {
    state: doctorsState,

    //actions
    async fetchServerData(requestData){
        //handle data from request adapters
        requestData = (requestData) ? requestData : {};

        if( this.state.requestData() )  requestData = { ...requestData, ...doctorsState.requestData() };

        const res = await doctorsApi.getItems(requestData);
        if(Object.keys(res).length > 0 && res.items){
            //if simply refresh data from server run refreshItems()
            if(requestData?.id || requestData?.ids){
                doctorsState.refreshItems(res.items);
            }else{
                doctorsState.setItems(res.items);
                doctorsState.setCount(res.count);
            }

        }



        //todo handle error
        return true;
    },

    //getters
    items(condition){
        if( !condition ) return this.state.getItems();
    },
    getItemsIdText(){
        return computed(() => this.state.getItems().value.map(i => { return{id:i.id, text:i.fullname}}));
    },


}
