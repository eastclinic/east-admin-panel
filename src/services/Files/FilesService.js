
import FilesApi from '../../api/FilesApi'


export default (() =>({

    //actions
    async filesUpload( files, requestData ){
        return  await FilesApi.fileUpload( files, requestData );
    },


}))();
