let onUploadProgressCallback = () =>{};
let file = null;
export default (() => ({
    _requestData : {},

    //setters

    forFile(fileBinary){
        this._requestData['files[]'] = fileBinary;
        file = fileBinary;
        return this;
    },

    withUploadProgressCallback(callback){
        onUploadProgressCallback = callback;
        return this;
    },

    with(field, value){
        if( !field ) return this;
        this._requestData[field] = value;
        return this;
    },



    //getters

    getRequestData() { return this._requestData; } ,

    getFile : ()=> file,

    getUploadProgressCallback(){
        return onUploadProgressCallback;
    }

    //
}))();
