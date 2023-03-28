export default (() => ({
    requestData : {},
    page(page){
        this.requestData['page'] = ( page ) ? page : 1;
        return this;
    },
    perPage(perPage){
        this.requestData['per_page'] = ( perPage ) ? perPage : 10;
        return this;
    },

    toArray() {return this.requestData},

}))();