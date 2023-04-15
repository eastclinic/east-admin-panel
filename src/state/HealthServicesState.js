import { reactive } from 'vue';

import MultiStateManager from '../services/util/MultiStateManager.js'
//init state
const HealthServicesState = {
    _state : reactive({}),
    ...MultiStateManager,

};
HealthServicesState.state();



export default HealthServicesState;
