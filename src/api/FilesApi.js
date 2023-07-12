import baseUrl from '@/api/config.js';


export default (() => ({

    async fileUpload( fileList, requestData ){
            if(!fileList || fileList.length === 0) return {}
        const formData = new FormData();

        for (let i = 0; i < fileList.length; i++) {
            formData.append('files[]', fileList[i]);
        }

        try {
            const res = await fetch(baseUrl + '/api/reviews/content', {method:'POST', body:formData});
            //todo handle server error (500, 502 ...)
            if(!res) return {};
            return await res.json()
        } catch (error) {
            // code to handle the error
            console.log("An error occurred:", error.message);
        }
        return {};


    },

    }))();
