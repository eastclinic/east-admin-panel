
import FilesApi from '../../api/FilesApi'
import toastService from "@/services/Toast";
import stateManager from "@/services/util/UseStateManager";
import doctorsApi from "@/api/DoctorsApi";
import fileUploadRequest from "@/services/Content/FileUploadRequest";


export default (() =>({
    requestInfo : {},
    state : stateManager.setGlobalWithName('Content'),
    //actions
    async fileUpload( fileUploadRequest ){
        if(!fileUploadRequest.getFile()) throw new Error('Not set file')
        if(!fileUploadRequest.getRequestData()) throw new Error('Not fill request data')
        return  await FilesApi.fileUpload( fileUploadRequest );
    },


    async fileDelete( file ){
        return  await FilesApi.fileDelete( file, this.requestInfo);
    },

    async save(contentData){
        const res = await FilesApi.save( contentData, this.requestInfo);

        if(res.data ){
            //toastService.duration(3000).success('Load image', 'Файл загружен')
        }else if(res.errors ){
            for ( const error in res.errors){
                if(Array.isArray(res.errors[error])){
                    for ( const key in res.errors[error]){
                        toastService.duration(5000).error('Load image', res.errors[error][key])
                    }

                }
            }
        }
        return res.data;
    },

    setRequestInfo(requestInfo){
        this.requestInfo = {...this.requestInfo, ...requestInfo};
        return this;
    },


    async fetchServerData(requestAdapter){
        //handle data from request adapters
        const response = await FilesApi.getContent(( requestAdapter ) ? requestAdapter.toArray() : null);
        this.state.setFromResponse(response);
        //todo handle error
        return this;
    },


    //getters
    items(condition){
        return this.state.getItems();
    },
    count(){
        return this.state.count();
    },

}))();
