import { reactive } from 'vue';

import MultiStateManager from '../services/util/MultiStateManager.js'
//init state
const ReviewsState = {
    _state : reactive({}),
    ...MultiStateManager,
};
ReviewsState.state();



export default ReviewsState;
