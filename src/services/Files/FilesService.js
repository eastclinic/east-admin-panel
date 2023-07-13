
import FilesApi from '../../api/FilesApi'


export default (() =>({

    //actions
    async filesUpload( files ){
        return  await FilesApi.fileUpload( files );
    },


}))();
