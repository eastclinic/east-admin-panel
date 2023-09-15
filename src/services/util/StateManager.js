import { ref, reactive, computed, toRef } from 'vue';

const _setCashItems = ( store, items ) => {
    if(!items || items.length === 0) return store;
    let cashItems = {};
    for (const item of items) cashItems[item.id] = item;
    return store._state._cash = { ...store._state._cash, ...cashItems};
}

const _setItemsIds = (store, items) => {
    let itemsIds = [];
    for (const item of items) itemsIds.push(item.id);
    return store._state.itemsIds = itemsIds;
}
export default  (() => ({
        _state : reactive({ count : 0, _cash: {}, itemsIds:{} }),

        //mutations
        setItems: function(items){
            if(!items)   return this;
            _setCashItems(this, items);
            _setItemsIds(this, items);
            return this;
        },

        setCount(count){
            this._state.count = count;
            return this;
        },

        setGlobalWithName(name){
            if(name) window[name] = this._state;
            return this;
        },


        //getters
        getItems(){        return toRef(this._state, 'items'); },

        count() {
            return this._state.count;
        }
    }
))();
