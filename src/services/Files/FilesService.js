
import FilesApi from '../../api/FilesApi'


export default (() =>({

    //actions
    async fileUpload( file, requestInfo ){
        return  await FilesApi.fileUpload( file, requestInfo);
    },


}))();
