import { reactive } from 'vue';

import MultiStateManager from '../services/util/MultiStateManager.js'
const DoctorsState = {
    _state : reactive({}),

};
//init state
MultiStateManager.state();

export default { ...MultiStateManager, ...DoctorsState };
