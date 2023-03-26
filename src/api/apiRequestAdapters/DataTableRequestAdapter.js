export default ()=> ({
    requestData : {},
    page(page){
        this.requestData['page'] = ( page ) ? page : 1;
    },
    build : ()=>this.requestData,

})();