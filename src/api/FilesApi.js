import baseUrl from '@/api/config.js';
import axios from "axios";
axios


export default (() => ({

    async fileUpload( file, requestData ){
    //if(!fileList || fileList.length === 0) return {}

// console.log(fileList[i])
        const formData = new FormData();
        formData.append('files[]', file);

        if(requestData.requestData){
            Object.keys(requestData.requestData).forEach((field)=>{
                formData.append(field, requestData.requestData[field]);
            });
        }

        let data = {};
        try {
             await axios.request({
                method: requestData.method,
                url: requestData.url,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: requestData.onUploadProgress
            }).then(response => {
                if(response?.data?.data?.[0]) data = response.data.data[0];
                //return response.data;
            })
                .catch(error => {
                    if(error?.response?.data?.errors){
                        data = error.response.data.errors;
                    }
                });

             return data;

        } catch (error) {
            // code to handle the error
            console.log("An error occurred:", error.message);
        }

    return {};


},

    }))();
