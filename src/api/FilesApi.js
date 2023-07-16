import baseUrl from '@/api/config.js';
import axios from "axios";
axios


export default (() => ({

    async fileUpload( fileList, requestData ){
    if(!fileList || fileList.length === 0) return {}



    for (let i = 0; i < fileList.length; i++) {
        // console.log(fileList[i])
        const formData = new FormData();
        formData.append('files[]', fileList[i]);

    if(requestData.requestData){
        Object.keys(requestData.requestData).forEach((field)=>{
            formData.append(field, requestData.requestData[field]);
        });
    }


    try {
        axios.request({
            method: requestData.method,
            url: requestData.url,
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: requestData.onUploadProgress(fileList[i].blobPath)
        })  .then(response => {
            return response.data;
        })
            .catch(error => {
                console.error(error);
            });

    } catch (error) {
        // code to handle the error
        console.log("An error occurred:", error.message);
    }
    }
    return {};


},

    }))();
