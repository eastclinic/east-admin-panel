import { reactive } from 'vue';

import MultiStateManager from '../services/util/MultiStateManager.js'
const ReviewsState = {
    _state : reactive({}),

};


export default { ...MultiStateManager, ...ReviewsState };
