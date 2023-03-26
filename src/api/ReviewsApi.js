import baseUrl from '@/api/config.js';
export default (() => ({

        requestData : {},
        async getReviews(apiRequestAdapter){
            if(apiRequestAdapter)
                this.requestData = {...this.requestData, ...apiRequestAdapter};
                const res = await fetch(baseUrl + '/api/reviews');
                if(!res) return {};
                const data = await res.json()
                if(!data || !data.items) return {};
                return data;



        },


    }))();
