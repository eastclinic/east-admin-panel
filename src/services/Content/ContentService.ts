import FilesApi from '../../api/FilesApi.js';
import toastService from '@/services/Toast.js';
import multiStateManager from "@/services/util/MultiStateManager.class.js";//probably to use one state manage for many services - its global stat
import {computed, reactive, ref, toRaw} from "vue";
import FileUploadRequest from "@/services/Content/FileUploadRequest.js";
import PreviewUploadInfo from "@/interfaces/AttachFiles/PreviewUploadInfo";
import FilesUploadInfo from "@/interfaces/AttachFiles/FilesUploadInfo";

class ContentService {
    state = new multiStateManager();
    attachedFiles = ref([]);
    targetType = null;
    targetId = null;
    constructor(state = null) {
        this.requestInfo = {};
        if(state) this.state = state;
    }

    with(field, val){
        this[field] = val
        return this;
    }

    async fileUploadToServer(fileUploadRequest) {
        if (!fileUploadRequest.getFile()) throw new Error('Not set file');
        if (!fileUploadRequest.getRequestData()) throw new Error('Not fill request data');
        return await FilesApi.fileUpload(fileUploadRequest);
    }

    async fileUpload(fileUploadRequest) {
        if (!fileUploadRequest.getFile()) throw new Error('Not set file');
        if (!fileUploadRequest.getRequestData()) throw new Error('Not fill request data');
        return await this.fileUploadToServer(fileUploadRequest);
    }

    async fileDelete(file) {
        return await FilesApi.fileDelete(file, this.requestInfo);
    }

    async save( contentData ) {
        const res = await FilesApi.save(contentData);
        if (res.data) {
            return res.data;

        }        else if (res.errors) {
            for (const error in res.errors) {
                if (Array.isArray(res.errors[error])) {
                    for (const key in res.errors[error]) {
                        toastService.duration(5000).error('Load image', res.errors[error][key]);
                    }
                }
            }
        }
        return res;
    }


    // async fetchServerData(requestAdapter) {
    //     const response = await FilesApi.getContent(requestAdapter ? requestAdapter.toArray() : null);
    //     this.state.setFromResponse(response);
    //     //todo handle error
    //     return this;
    // }

    items(condition) {
        return this.state.getItems();
    }

    count() {
        return this.state.count();
    }

    getFileType(file) {
        if (file.typeFile) return file.typeFile;
        if (!file.type) return null;
        let mimeFile = file.type;
        mimeFile = mimeFile.split('/');
        return mimeFile[0];
    }

    getFileExtension(file) {
        if (!file.type) return null;
        let mimeFile = file.type;
        mimeFile = mimeFile.split('/');
        return mimeFile[1];
    }

    async filesUpload( filesUploadInfo : FilesUploadInfo) {
        for (let i = 0; i < filesUploadInfo.files.length; i++) {
            if (!this.checkUploadFileParameters(filesUploadInfo.files[i])) continue ;
            const typeFile = this.getFileType(filesUploadInfo.files[i])
            filesUploadInfo.attachFiles.value.push( reactive({
                typeFile: typeFile,
                blobPath: URL.createObjectURL(filesUploadInfo.files[i]),  //temp path for show image
                loadPersent: 0,
                errors: {},
                data:{},
                id:0,   //random temp id
                url:''
            }));
            filesUploadInfo.files[i].attachFileIndex = filesUploadInfo.attachFiles.value.length-1;
        }

        for ( const i in filesUploadInfo.files ) {
            let aIndex =  filesUploadInfo.files[i].attachFileIndex;
            if(!filesUploadInfo.attachFiles.value[aIndex]) continue;
            let res = await this.fileUpload(
                (new FileUploadRequest)
                    .forFile(filesUploadInfo.files[i])
                    .with('contentable_id', filesUploadInfo.targetId)
                    .with('contentable_type', filesUploadInfo.targetType)
                    .with('original_file_name', filesUploadInfo.files[i].name)
                    .withUploadProgressCallback(progressEvent => {
                        filesUploadInfo.attachFiles.value[aIndex].loadPersent = Math.round(progressEvent.loaded * 100 / progressEvent.total);
                        //todo save all upload progress
                    })
            );

            if(res.data ){
                filesUploadInfo.attachFiles.value[aIndex] = {...res.data}
                toastService.duration(3000).success('Load image', 'Файл загружен')
            }else if(res.errors ){
                for ( const error in res.errors){
                    if(Array.isArray(res.errors[error])){
                        for ( const key in res.errors[error]){
                            toastService.duration(5000).error('Load image', res.errors[error][key])
                        }

                    }
                }
                filesUploadInfo.attachFiles.value.splice(aIndex, 1);
            }
        }

    }


    checkUploadFileParameters (files, possibleParameters){
        let mimeFile = ''

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if(file.type) mimeFile = file.type;
            if(mimeFile) mimeFile = mimeFile.split('/');
            if( mimeFile.length === 0 ) {
                toastService.duration(5000).error('Критическая ошибка, неверный формат загрузки файлов на сервер обратитесь к разработчикам' )
                return ;
            }
            const fileExtension = this.getFileExtension(file);

//check file extension
            if(!possibleParameters.possibleExtensions.includes(fileExtension)){
                toastService.duration(5000).error('Неверный тип файла ' + file.name + '. Допустимо до (' +  possibleParameters.possibleExtensions.join(', ') + ')', )
                return;
            }
//check file size
            if(file.size < 1 || file.size > possibleParameters.maxSizeFile){
                console.log('here')
                toastService.duration(5000).error('Слишком большой размер файла ' + file.name + '. (' + Math.round(file.size/1000)  +' kb) Допустимо ' + Math.round( possibleParameters.maxSizeFile/1000) +'kb', )
                return;
            }
        }

        return true;
    }

    async removeFile(file, attachFiles){
        if(!file.id)  return false;
        const i = attachFiles.value.findIndex(aFile => aFile.id === file.id)
        if(i === -1) return false;
        //if file.confirm ===  1 temporally deactivate file only on front


        attachFiles.value[i].isDeleted = true;
        if(!file.confirm){
            attachFiles.value.splice(i, 1);
            const res = await this.fileDelete(file);
            if(res && res.ok && res.message){
                toastService.success('Удаление файла', res.message)
                return true;
            }

        }else{
            attachFiles.value[i].isDeleted = true;

        }
    }
    async uploadVideoPreviewFile(previewInfo : PreviewUploadInfo){
        const file = previewInfo.filePreview;
        let res = await this.fileUpload(
            (new FileUploadRequest)
                .forFile(file)
                .with('contentable_id', previewInfo.targetId)
                .with('contentable_type', previewInfo.targetType)
                .with('is_preview_for', previewInfo.previewForVideoId)
                .with('original_file_name', file.name)
        );

        if(res?.data?.id ){
            previewInfo.videoInfo.previewOriginal = reactive(res.data);
            toastService.duration(3000).success('Load image', 'Файл загружен')
        }else if(res.errors ) {
            for (const error in res.errors) {
                if (Array.isArray(res.errors[error])) {
                    for (const key in res.errors[error]) {
                        toastService.duration(5000).error('Load image', res.errors[error][key])
                    }

                }
            }


        }
    }

}

export default ContentService;
