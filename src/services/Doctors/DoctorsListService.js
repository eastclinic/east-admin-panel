
import DoctorsInfoService from './DoctorsInfoService'

export default {
    //extends DoctorsInfoService
    ...DoctorsInfoService,

    //actions

    //getters
    items(condition){
        if( !condition ) return this.state.getItems();
    },


}
