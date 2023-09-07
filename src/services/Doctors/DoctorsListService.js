
import DoctorsInfoService from './DoctorsInfoService'

// export default {
//     //extends DoctorsInfoService
//     ...DoctorsInfoService,
//
//     //actions
//
//     //getters
//     items(condition){
//         if( !condition ) return this.state.getItems();
//     },
//
//
// }


export default  (() => {

    let instance = null;

    return class GlobalStore {
        constructor() {
            if(instance === null) {
                instance = this;
            }
            return instance;
        }
    }
})();
