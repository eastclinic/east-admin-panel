import { reactive, computed } from 'vue';

export default {
    _storeName:'default',
    setItems(items){
        if(!items)   return this;
        if(!this._state[this._storeName]) this._state[this._storeName] = {};
        return this._setCashItems(items)._setItemsIds(items);
    },
    _setCashItems(items){
        if(!this._state[this._storeName]._cash) this._state[this._storeName]._cash = {};
        let cashItems = {};
        for (const item of items) cashItems[item.id] = item;
        this._state[this._storeName]._cash = { ...this._state[this._storeName]._cash, ...cashItems};
        return this;
    },
    _setItemsIds(items){
        if(!this._state[this._storeName].itemsIds) this._state[this._storeName].itemsIds = {};
        let itemsIds = [];
        for (const item of items) itemsIds.push(item.id);
        this._state[this._storeName].itemsIds = itemsIds;
        return this;
    },
    getItems(){
        const store = this._state[this._storeName];
        if( !store || !store.itemsIds || !store._cash ) return[];
        let items = [];
        for (const id of store.itemsIds) {
            if( store._cash[id] )items.push(store._cash[id]);
        }
        return items;
    }

};
