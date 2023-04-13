import baseUrl from '@/api/config.js';
import UseRequestAdapters from '@/services/util/UseRequestAdapters.js';

export default (() => ({
        ...UseRequestAdapters,
        _requestData : {},
        async getReviews(requestData){
            let request = {method:'GET'}
            let requestUrl = baseUrl + '/api/reviews';
            if(requestData.id){
                requestUrl += '/'+requestData.id;
            }
            else {
                if( Object.keys(requestData).length > 0 ){

                    // Create the URL with the parameters
                    const queryParams = new URLSearchParams(requestData);
                    requestUrl += '?'+queryParams;
                }
            }
            const res = await fetch(requestUrl, request);
            if(!res) return {};
            const data = await res.json()
            if(!data || !data.items) return {};
            return data;
        },
    async saveReview( saveData ){
        console.log(saveData)
            if(!saveData || Object.keys(saveData).length === 0) return {}

        let request = {
            body: JSON.stringify(saveData),
            headers: {
                'Content-Type': 'application/json'
            },
        };
        let url = baseUrl + '/api/reviews';
        if(saveData.id ) {
            request['method'] = 'PUT';
            url += '/' + saveData.id;
        }else {
            //if not have id - its create new review
            request['method'] = 'POST';
        }
        if(!saveData.id || Object.keys(saveData).length < 2 ) return {};





        const res = await fetch(url, request);
        //todo handle server error (500, 502 ...)
        if(!res) return {};
        return await res.json()
    },


    }))();
