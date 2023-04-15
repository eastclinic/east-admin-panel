
import healthServicesState from '@/state/HealthServicesState.js'
import healthRootServicesApi from '../../api/health/HealthRootServicesApi'
import {computed} from "vue";


export default (() =>({
    state: healthServicesState,
    requestData:{},

    //actions
    //todo set definition requestAdapter type
    async fetchServerData(requestData){
        //handle data from request adapters
        requestData = (requestData) ? requestData : {};

        if( healthServicesState.requestData() )  requestData = { ...requestData, ...healthServicesState.requestData() };

        const res = await healthRootServicesApi.getItems(requestData);
        if(Object.keys(res).length > 0 && res.items){
            //if simply refresh data from server run refreshItems()
            if(requestData?.id || requestData?.ids){
                healthServicesState.refreshItems(res.items);
            }else{
                healthServicesState.setItems(res.items);
                healthServicesState.setCount(res.count);
            }

        }



        //todo handle error
        return true;
    },


    async saveRootService( data ){
        return  await healthRootServicesApi.saveRootService(data);
    },

    //getters
    rootServices(condition){
        //if( !condition )
            return this.state.getItems();
    },
    getItemsIdText(){
        return computed(() => this.state.getItems().value.map(i => { return{id:i.id, text:i.fullname}}));
    },

    count(){   return this.state.count();  },

}))();
