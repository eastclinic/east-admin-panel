
import FilesApi from '../../api/FilesApi'


export default (() =>({

    //actions
    async filesUpload( files, requestInfo ){
        return  await FilesApi.fileUpload( files, requestInfo);
    },


}))();
