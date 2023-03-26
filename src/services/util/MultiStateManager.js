import { reactive } from 'vue';

export default {
    _state : reactive({_cash:{}}),
    setItems(items){

        if(!items)   return this;
        return this._setCashItems(items);
    },
    _setCashItems(items){
        let cashItems = {};
        for (const item of items) cashItems[item.id] = item;
        this._state._cash = { ...this._state._cash, ...cashItems};
        return this;
    },

};
