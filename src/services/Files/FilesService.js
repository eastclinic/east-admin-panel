
import FilesApi from '../../api/FilesApi'
import toastService from "@/services/Toast";


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

}))();
