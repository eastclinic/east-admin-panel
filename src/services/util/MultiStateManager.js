// import { reactive, computed } from 'vue';

export default (() => ({
    _stateName:'default',
    _requestData:{},
    //mutations
    setItems(items){
        if(!items)   return this;
        if(!this._state[this._stateName]) this._state[this._stateName] = {};
        return this._setCashItems(items)._setItemsIds(items);
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
    setCount(count){

        this._state[this._stateName].count = count;
        return this;
    },
    state(name){
        name = (name) ? name : 'default';
        this._stateName = name;
        if(!this._state[this._stateName])this._state[this._stateName] = {count:0}
        window.state1 = this._state[this._stateName];
        return this;
    },

    //actions
    getItems(){
        const store = this._state[this._stateName];
        if( !store || !store.itemsIds || !store._cash ) return[];
        let items = [];
        for (const id of store.itemsIds) {
            if( store._cash[id] )items.push(store._cash[id]);
        }
        return items;
    },


    //getters
    requestData(){
        return this._requestData;
    },
    count(){
       return this._state[this._stateName].count;

    }

}))();
