import { reactive } from 'vue';

import MultiStateManager from '../services/util/MultiStateManager.class.js'
//init state
// const DoctorsState = {
//     _state : reactive({}),
//     ...MultiStateManager,
//
// };
//init state


const DoctorsState = (() => {
    let instance = null;
    let s = 10;
    debugger;
    return class DoctorsState extends MultiStateManager{

        constructor(...args) {
            super (...args);
            if(instance === null) {
                instance = this;
            }
            debugger;
            return instance;
        }
    }
})();

// const DoctorsState2 =  (function() {
//     var privateVar = '';
//     function privateMethod () {
//         // ...
//     }
//
//     return { // public interface
//         ...MultiStateManager,
//         _state : reactive({}),
//         publicMethod1: function () {
//             // All private members are accessible here
//         },
//         publicMethod2: function () {
//         }
//     };
// })();
// DoctorsState.state();//

export default new DoctorsState();
