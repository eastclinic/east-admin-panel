import FilesApi from '../../api/FilesApi';
import toastService from "@/services/Toast";
import StateManager from "@/services/util/StateManager.class";//probably to use one state manage for many services - its global stat
import {computed, reactive, ref, toRaw} from "vue";
import FileUploadRequest from "@/services/Content/FileUploadRequest";


class ContentService {
    props = null;
    state = new StateManager();
    attachedFiles = ref([]);
    constructor(state = null) {
        this.requestInfo = {};
        if(state) this.state = state;
    }

    // attachFiles(){
    //     return this.state.computed( 'attachFiles', this.props.files );
    // }

    init(){
        if(!this.props) throw new Error('Not set props');
        this.attachFiles= this.state.computed( 'attachFiles', this.props.files );
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

    async save(contentData) {
        const res = await FilesApi.save(contentData, this.requestInfo);

        if (res.data) {
            //toastService.duration(3000).success('Load image', 'Файл загружен')
        } else if (res.errors) {
            for (const error in res.errors) {
                if (Array.isArray(res.errors[error])) {
                    for (const key in res.errors[error]) {
                        toastService.duration(5000).error('Load image', res.errors[error][key]);
                    }
                }
            }
        }
        return res.data;
    }

    setRequestInfo(requestInfo) {
        this.requestInfo = { ...this.requestInfo, ...requestInfo };
        return this;
    }

    async fetchServerData(requestAdapter) {
        const response = await FilesApi.getContent(requestAdapter ? requestAdapter.toArray() : null);
        this.state.setFromResponse(response);
        //todo handle error
        return this;
    }

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

    async filesUpload( files ) {
        if(!this.props)  throw new Error('not set props');
        for (let i = 0; i < files.length; i++) {
            if (!this.checkUploadFileParameters(files[i])) continue ;
            const typeFile = this.getFileType(files[i])
            this.attachFiles.value.push( reactive({
                typeFile: typeFile,
                blobPath: URL.createObjectURL(files[i]),  //temp path for show image
                loadPersent: 0,
                errors: {},
                data:{},
                id:0,   //random temp id
                url:''
            }));
            files[i].attachFileIndex = this.attachFiles.value.length-1;
        }

        for ( const i in files ) {
            let aIndex =  files[i].attachFileIndex;
            if(!this.attachFiles.value[aIndex]) continue;
            let res = await this.fileUpload(
                (new FileUploadRequest)
                    .forFile(files[i])
                    .with('contentable_id', this.props.targetId)
                    .with('contentable_type', this.props.targetType)
                    .withUploadProgressCallback(progressEvent => {
                        this.attachFiles.value[aIndex].loadPersent = Math.round(progressEvent.loaded * 100 / progressEvent.total);
                        //todo save all upload progress
                    })
            );

            if(res.data ){
                this.attachFiles.value[aIndex] = {...res.data}
                toastService.duration(3000).success('Load image', 'Файл загружен')
            }else if(res.errors ){
                for ( const error in res.errors){
                    if(Array.isArray(res.errors[error])){
                        for ( const key in res.errors[error]){
                            toastService.duration(5000).error('Load image', res.errors[error][key])
                        }

                    }
                }
                this.attachFiles.value.splice(aIndex, 1);
            }
        }

    }



    withProps(props){
        this.props = props;
        this.init();
        return this;
    }

    checkUploadFileParameters (file){
        let mimeFile = ''
        if(file.type) mimeFile = file.type;
        if(mimeFile) mimeFile = mimeFile.split('/');
        if( mimeFile.length === 0 ) {
            toastService.duration(5000).error('Критическая ошибка, неверный формат загрузки файлов на сервер обратитесь к разработчикам' )
            return ;
        }
        const fileExtension = this.getFileExtension(file);

//check file extension
        if(!this.props.possibleExtensions.includes(fileExtension)){
            toastService.duration(5000).error('Неверный тип файла ' + file.name + '. Допустимо до (' +  this.props.possibleExtensions.join(', ') + ')', )
            return;
        }
//check file size
        if(file.size < 200 || file.size > this.props.maxSizeFile){
            toastService.duration(5000).error('Слишком большой размер файла ' + file.name + '. (' + Math.round(file.size/1000)  +' kb) Допустимо ' + Math.round( this.props.maxSizeFile/1000) +'kb', )
            return;
        }
        return true;
    }

    async removeFile(file){
        if(!file.id)  return false;
        const i = this.attachFiles.value.findIndex(aFile => aFile.id === file.id)
        if(i === -1) return false;
        //if file.confirm ===  1 temporally deactivate file only on front


        this.attachFiles.value[i].isDeleted = true;
        if(!file.confirm){
            this.attachFiles.value.splice(i, 1);
            const res = await this.fileDelete(file);
            if(res && res.ok && res.message){
                toastService.success('Удаление файла', res.message)
                return true;
            }

        }else{
            this.attachFiles.value[i].isDeleted = true;

        }
    }
    async uploadVideoPreviewFile(file, videoId){
        if(!videoId) return ;
        if (!this.checkUploadFileParameters(file)) return ;
        let res = await this.fileUpload(
            (new FileUploadRequest)
                .forFile(file)
                .with('contentable_id', this.props.targetId)
                .with('contentable_type', this.props.targetType)
                .with('is_preview_for', this.uploadVideoPreview.value.videoId)
        );

        if(res?.data?.id ){
            for (const fileIndex in this.attachedFiles.value) {
                if(this.attachedFiles.value[fileIndex].id === this.uploadVideoPreview.value.videoId){
                    this.attachedFiles.value[fileIndex].preview = res.data;
                    // this.attachedFiles.value[fileIndex].preview_id = res.data.id;
                }
            }
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
