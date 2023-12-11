
import FilesApi from '../../api/FilesApi'
import toastService from "@/services/Toast";
import stateManager from "@/state/ContentState";

import {reactive, toRaw, ref, toRefs, computed} from "vue";
import fileUploadRequest from "@/services/Content/FileUploadRequest";
async function fileUploadToServer( fileUploadRequest ){
    if(!fileUploadRequest.getFile()) throw new Error('Not set file')
    if(!fileUploadRequest.getRequestData()) throw new Error('Not fill request data')
    return  await FilesApi.fileUpload( fileUploadRequest );
};


const tempFiles = reactive([] );

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

    getFileType(file){
        if(file.typeFile) return file.typeFile;
        if(!file.type) return null;
        let mimeFile = file.type;
        mimeFile = mimeFile.split('/');
        return mimeFile[0];
    },

    getFileExtension(file){
        if(!file.type) return null;
        let mimeFile = file.type;
        mimeFile = mimeFile.split('/');
        return mimeFile[1];
    },


    async filesUpload  (newFiles, props){

        for (let i = 0; i < newFiles.length; i++) {
            const file = newFiles[i];
            const fileName = file.name;
            let mimeFile = ''
            if(file.type) mimeFile = file.type;
            if(mimeFile) mimeFile = mimeFile.split('/');
            if( mimeFile.length === 0 ) {
                throw new Error('Критическая ошибка, неверный формат загрузки файлов на сервер обратитесь к разработчикам');
            }
            const fileExtension = mimeFile[1]
            const typeFile = mimeFile[0]
//check file extension
            if(!props.possibleExtensions.includes(fileExtension)){
                throw new Error( 'Неверный тип файла ' + fileName + '. Допустимо до (' + props.possibleExtensions.join(', ') + ')' );
            }
//check file size
            if(file.size < 200 || file.size > props.maxSizeFile){
                throw new Error( 'Слишком большой размер файла ' + fileName + '. (' + Math.round(file.size/1000)  +' kb) Допустимо ' + Math.round(props.maxSizeFile/1000) +'kb' );
            }

            const randomId = Math.floor(Math.random() * 1000)
            this.state.saveTempFile({
                typeFile: typeFile,
                blobPath: URL.createObjectURL(file),  //temp path for show image
                loadPersent: 0,
                errors: {},
                data:{},
                id:randomId,   //random temp id
                url:''
            })
            // this.state.getState()..push({
            //     typeFile: typeFile,
            //     blobPath: URL.createObjectURL(file),  //temp path for show image
            //     loadPersent: 0,
            //     errors: {},
            //     data:{},
            //     id:0,   //random temp id
            //     tempFileId:randomId,
            //     url:''
            // });

            newFiles[i].tempFileId = randomId;
        }


        // for ( const i in newFiles ) {
        //     const file = newFiles[i];
        //     const tempFileId =  file.tempFileId;
        //
        //     if(!tempFileId) continue;
        //     let res = await fileUploadToServer(
        //         fileUploadRequest
        //             .forFile(file)
        //             .with('contentable_id', props.targetId)
        //             .with('contentable_type', props.targetType)
        //             .withUploadProgressCallback(progressEvent => {
        //                 tempFiles[i].loadPersent = Math.round(progressEvent.loaded * 100 / progressEvent.total);
        //                 //todo save all upload progress
        //             })
        //     );
        // }
            // if(res.data ){
            //     attachFiles.value[aIndex] = {...res.data}
            //     toastService.duration(3000).success('Load image', 'Файл загружен')
            // }else if(res.errors ){
            //     for ( const error in res.errors){
            //         if(Array.isArray(res.errors[error])){
            //             for ( const key in res.errors[error]){
            //                 toastService.duration(5000).error('Load image', res.errors[error][key])
            //             }
            //
            //         }
            //     }
            //     attachFiles.value.splice(aIndex, 1);
            // }



    }

}))();
