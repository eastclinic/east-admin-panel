
import FilesApi from '../../api/FilesApi'


export default (() =>({
    requestInfo : {},

    //actions
    async fileUpload( file, requestInfo ){
        if(requestInfo)  this.setRequestInfo(requestInfo);
        return  await FilesApi.fileUpload( file, this.requestInfo);
    },


    async fileDelete( file ){
        return  await FilesApi.fileDelete( file, this.requestInfo);
    },

    setRequestInfo(requestInfo){
        this.requestInfo = {...this.requestInfo, ...requestInfo};
        return this;
    },

}))();
