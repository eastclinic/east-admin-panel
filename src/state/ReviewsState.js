import { reactive } from 'vue';

import MultiStateManager from '../services/util/MultiStateManager.js'
const ReviewsState = {
    _state : reactive({_cash: {}}),

};


export default { ...MultiStateManager, ...ReviewsState };
