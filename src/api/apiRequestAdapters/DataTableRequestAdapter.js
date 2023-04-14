export default (() => ({
    _requestData : {},
    page(page){
        this._requestData['page'] = ( page ) ? page : 1;
        return this;
    },
    perPage(perPage){
        this._requestData['per_page'] = ( perPage ) ? perPage : 10;
        return this;
    },
    _page(event){
        this._requestData['page'] = ( event.page ) ? event.page + 1 : 1;
        return this;
    },

    _perPage(event){
        this._requestData['per_page'] = ( event.rows ) ? event.rows : 10;
        return this;
    },
    _multiSort(event){
        //todo not work multisort(, only 1 column in sort
        if(!event || !event.multiSortMeta || !event.multiSortMeta[0]) {
            delete this._requestData.sort;
            return this;
        }
        const { field, order } = event.multiSortMeta[0];
        this._requestData['sort'] = {};
        this._requestData['sort'][field] = order;
        return this;
    },

    dtEvent(event){
        this._page(event)
            ._perPage(event)
            ._multiSort(event)
        return this;
    },
    data(){ return {...this._requestData} },
    clear(){
        this._requestData = {};
        return this;
    },
    requestData() {return {...this._requestData}},
    //
}))();
