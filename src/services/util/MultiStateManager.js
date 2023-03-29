import { ref, reactive, computed, toRef } from 'vue';

export default (() => ({
    _stateName:'default',
    _requestData:{},
    //mutations
    setItems(items){
        if(!items)   return this;
        return this._setCashItems(items)._setItemsIds(items)._setItems(items);
    },
    _setCashItems(items){
        if(!this._state[this._stateName]._cash) this._state[this._stateName]._cash = {};
        let cashItems = {};
        for (const item of items) cashItems[item.id] = item;
        this._state[this._stateName]._cash = { ...this._state[this._stateName]._cash, ...cashItems};
        return this;
    },

    _setItemsIds(items){
        if(!this._state[this._stateName].itemsIds) this._state[this._stateName].itemsIds = {};
        let itemsIds = [];
        for (const item of items) itemsIds.push(item.id);
        this._state[this._stateName].itemsIds = itemsIds;
        return this;
    },
    _setItems(items){
        if(!this._state[this._stateName].itemsIds)  return this;
        const store = this._state[this._stateName];
        let itemsStore = [];
        for (const id of store.itemsIds) {
            if( store._cash[id] )   itemsStore.push(store._cash[id]);
        }
        this._state[this._stateName].items = itemsStore;
        return this;
    },
    setCount(count){

        this._state[this._stateName].count = count;
        return this;
    },
    state(name){
        name = (name) ? name : 'default';
        this._stateName = name;
        if(!this._state[this._stateName])this._state[this._stateName] = { count : 0, items : [] }
        window.state1 = this._state[this._stateName];
        return this;
    },


    //getters
    getItems(){        return toRef(this._state[this._stateName], 'items'); },

    requestData(){      return this._requestData;    },

    count() {
        return toRef(this._state[this._stateName], 'count');
        }
}))();
