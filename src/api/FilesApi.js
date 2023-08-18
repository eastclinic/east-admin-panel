import baseUrl from '@/api/config.js';
import axios from "axios";


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
                method: 'POST',
                url: requestData.url,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: requestData.onUploadProgress
            }).then(response => {
                if(response?.data?.data?.[0]) data.data = response.data.data[0];
                //return response.data;
            })
                .catch(error => {
                    if(error?.response?.data?.errors){
                        data.errors = error.response.data.errors;
                    }
                });

             return data;

        } catch (error) {
            // code to handle the error
            console.log("An error occurred:", error.message);
        }

    return {};


},

    async fileDelete( file, requestData ){
        if(!file.id) return {};
        const res =  await fetch(requestData.url+'/'+file.id, {
            method:'DELETE'
        });
        if(!res) return {};
        return  await res.json()
    }
    }))();
