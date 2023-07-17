
import FilesApi from '../../api/FilesApi'


export default (() =>({
    requestInfo : {},

    //actions
    async fileUpload( file ){
        return  await FilesApi.fileUpload( file, this.requestInfo);
    },


    async fileDelete( id ){
        return  await FilesApi.fileDelete( id, this.requestInfo);
    },

    setRequestInfo(requestInfo){
        this.requestInfo = requestInfo;
        return this;
    },

}))();
