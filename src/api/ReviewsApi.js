import baseUrl from '@/api/config.js';
import UseRequestAdapters from '@/services/util/UseRequestAdapters.js';

export default (() => ({
        ...UseRequestAdapters,
        _requestData : {},
        async getReviews(){
            let request = {method:'GET'}
            if( Object.keys(this._requestData).length > 0 ){
                request['body'] = JSON.stringify(this._requestData);
            }
            const res = await fetch(baseUrl + '/api/reviews', request);
            if(!res) return {};
            const data = await res.json()
            if(!data || !data.items) return {};
            return data;
        },
    }))();
