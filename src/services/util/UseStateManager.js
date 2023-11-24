import { ref, reactive, computed, toRef } from 'vue';


export default  (() => ({
        _state : reactive({ count : 0, items:{}, totalPages:0, perPage:0, page:0 }),

        //mutations
        setGlobalWithName(name){
            if(name) window[name] = this._state;
            return this;
        },
        setFromResponse(response){
            if( response?.items ) this._state.items = response.items;
            if( response?.count ) this._state.count = response.count;
            if( response?.total_pages ) this._state.totalPages = response.total_pages;
            if( response?.per_page ) this._state.totalPages = response.per_page;
            if( response?.page ) this._state.page = response.page;
            return this;
        },



        //getters
        getItems(){
            return this._state.items;
        },

        getCount() {
            return this._state.count;
        },

        getTotalPages() {
            return this._state.totalPages;
        }
    }
))();
