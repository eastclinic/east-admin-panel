import baseUrl from '@/api/config.js';
export default (() => ({

        _requestData : {},
        async getReviews(){
            const res = await fetch(baseUrl + '/api/reviews');
            if(!res) return {};
            const data = await res.json()
            if(!data || !data.items) return {};
            return data;
        },
    withRequestData(data){
            if(typeof data === 'object' && data !== null)
            this._requestData = { ...this._requestData, ...data}
            return this;
    },

    }))();
