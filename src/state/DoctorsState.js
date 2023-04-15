

import MultiStateManager from '@/services/util/MultiStateManager.js'
//init state
const state = {
    //_state : reactive({}),
    ...MultiStateManager,

};
state.state();



export default state;
