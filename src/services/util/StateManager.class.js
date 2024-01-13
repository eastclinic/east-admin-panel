import { reactive } from 'vue';

class StateManager {
    constructor() {
        this._state = reactive({ count: 0, _cash: {}, itemsIds: {} });
    }

    // Mutations
    setItems(items) {
        if (!items) return this;
        this._setCashItems(items);
        this._setItemsIds(items);
        return this;
    }

    setCount(count) {
        this._state.count = count;
        return this;
    }

    setGlobalWithName(name) {
        if (name) window[name] = this._state;
        return this;
    }

    refreshItems(items) {
        if (!items) return this;
        this._setCashItems(items);
        this._refreshItems(items);
        return this;
    }

    // Getters
    getItems() {
        const items = [];
        for (const n in this._state.itemsIds) {
            const id = this._state.itemsIds[n];
            if (this._state._cash[id]) items.push(this._state._cash[id]);
        }
        return items;
    }

    item(id) {
        return this._state._cash[id];
    }

    getCount() {
        return this._state.count;
    }

    // Private methods
    _setCashItems(items) {
        if (!items || items.length === 0) return;
        let cashItems = {};
        for (const item of items) cashItems[item.id] = item;
        this._state._cash = { ...this._state._cash, ...cashItems };
    }

    _setItemsIds(items) {
        let itemsIds = [];
        for (const item of items) itemsIds.push(item.id);
        this._state.itemsIds = itemsIds;
    }

    _refreshItems(items) {
        if (!items || items.length === 0) return;
        let itemsNew = {};
        let existItems = [];
        for (const item of items) itemsNew[item.id] = item;
        if (this._state.items.length === 0) {
            this._state.items = Object.values(itemsNew);
        } else {
            for (const item of this._state.items) {
                existItems.push(itemsNew[item.id] ? itemsNew[item.id] : item);
            }
            this._state.items = existItems;
        }
    }
}

export default StateManager;
