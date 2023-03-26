import { reactive } from 'vue';

import MultiStateManager from '../services/util/MultiStateManager.js'
const DoctorsState = {
    _state : reactive({}),

};


export default { ...MultiStateManager, ...DoctorsState };
