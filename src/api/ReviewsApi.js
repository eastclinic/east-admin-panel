import baseUrl from '@/api/config.js';
import UseRequestAdapters from '@/services/util/UseRequestAdapters.js';

export default (() => ({
        ...UseRequestAdapters,
        _requestData : {},
        async getReviews(){
            let request = {method:'GET'}
            let requestUrl = baseUrl + '/api/reviews';
            if( Object.keys(this._requestData).length > 0 ){
                // Create the URL with the parameters
                const queryParams = new URLSearchParams(this._requestData);
                requestUrl += '?'+queryParams;
                //request['body'] = JSON.stringify(this._requestData);
            }

            console.log(requestUrl)
            const res = await fetch(requestUrl, request);
            if(!res) return {};
            const data = await res.json()
            if(!data || !data.items) return {};
            return data;
        },
    }))();
