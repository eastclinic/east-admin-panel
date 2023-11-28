import { reactive, toRaw } from 'vue';
import stateManager from "@/services/util/UseStateManager";
//init state

const ContentState = {
    ...stateManager,
    _state : reactive({ count : 0, items:[], _cash:{}, itemsIds:[], tempFiles:[], totalPages:0, perPage:0, page:0 }),

    saveTempFile( fileInfo ){

        this._state._cash[fileInfo.id] = reactive(fileInfo);
        const itemsIds = this._state.itemsIds
        itemsIds.push(fileInfo.id)
        this._state.itemsIds = reactive(itemsIds);
    },

    removeTempFileById( id ){
        this.setItems([...this.getItems()].filter((item) => item.id !== id));
    },


    getTempItem(id, byField){
        this._state
    },

    getState() {
        return this._state;
    }


};

export default ContentState;
