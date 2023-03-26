import { reactive, computed } from 'vue';

export default {
    _stateName:'default',
    setItems(items){
        if(!items)   return this;
        if(!this._state[this._stateName]) this._state[this._stateName] = {};
        return this._setCashItems(items)._setItemsIds(items);
    },

    getItems(){
        const store = this._state[this._stateName];
        if( !store || !store.itemsIds || !store._cash ) return[];
        let items = [];
        for (const id of store.itemsIds) {
            if( store._cash[id] )items.push(store._cash[id]);
        }
        return items;
    },

    state(name){
        name = (name) ? name : 'default';
        this._stateName = name;
        return this;
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


};
