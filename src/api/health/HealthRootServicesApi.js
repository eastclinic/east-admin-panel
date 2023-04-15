import baseUrl from '@/api/config.js';
import UseRequestAdapters from '@/services/util/UseRequestAdapters.js';
import urlBuilder from '@/services/util/BuildUrlWithQueryParams.js';

export default (() => ({
        ...UseRequestAdapters,
        _requestData : {},
        async getItems(requestData){
            let request = {method:'GET'}
            let requestUrl = baseUrl + '/api/health/services';
            if(requestData.id){
                requestUrl += '/'+requestData.id;
            }
            else {
                if( Object.keys(requestData).length > 0 ){

                    // Create the URL with the parameters
                    //const queryParams = this._buildSearchParams(requestData);
                    requestUrl = urlBuilder._buildURL(requestUrl, requestData)
                    //requestUrl += '?'+queryParams;
                }
            }

            try {
                const res = await fetch(requestUrl, request);
                if(!res) return {};
                const data = await res.json()
                if(!data || !data.items) return {};
                return data;
            }catch (e) {
                console.log(e)
            }
        },
    async saveReview( saveData ){
            if(!saveData || Object.keys(saveData).length === 0) return {}

        let request = {
            body: JSON.stringify(saveData),
            headers: {
                'Content-Type': 'application/json'
            },
        };
        let url = baseUrl + '/api/health/services';
        if(saveData.id ) {
            request['method'] = 'PUT';
            url += '/' + saveData.id;
        }else {
            //if not have id - its create new review
            request['method'] = 'POST';
        }
        try {
            const res = await fetch(url, request);
            console.log(request)
            console.log(url)
            console.log(res)
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
