import baseUrl from '@/api/config.js';
import UseRequestAdapters from '@/services/util/UseRequestAdapters.js';
import UseGetParametersBuilder from '@/services/util/UseGetParametersBuilder.js';

export default (() => ({
        ...UseRequestAdapters,
        ...UseGetParametersBuilder,
        _requestData : {},
        async getDoctors(requestData){
            let request = {method:'GET'}
            let requestUrl = baseUrl + '/api/doctors';
            if(requestData.id){
                requestUrl += '/'+requestData.id;
            }
            else {
                if( Object.keys(requestData).length > 0 ){
                    // Create the URL with the parameters
                    requestUrl = this._buildURL(requestUrl, requestData)
                }
            }
            const res = await fetch(requestUrl, request);
            if(!res) return {};
            const data = await res.json()
            if(!data || !data.items) return {};
            return data;
        },
    async saveDoctor( saveData ){
            if(!saveData || Object.keys(saveData).length === 0) return {}

        let request = {
            body: JSON.stringify(saveData),
            headers: {
                'Content-Type': 'application/json'
            },
        };
        let url = baseUrl + '/api/doctors';
        if(saveData.id ) {
            request['method'] = 'PUT';
            url += '/' + saveData.id;
        }else {
            //if not have id - its create new review
            request['method'] = 'POST';
        }
        try {
            const res = await fetch(url, request);
            //todo handle server error (500, 502 ...)
            if(!res) return {};
            return await res.json()
        } catch (error) {
            // code to handle the error
            console.log("An error occurred:", error.message);
        }
        return {};


    },

    async deleteDoctor(id){
        let url = baseUrl + '/api/doctors/'+id;
        const request = {
            headers: {
                'Content-Type': 'application/json'
            },
            method : 'DELETE'
        };
        try {
            const res = await fetch(url, request);
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
