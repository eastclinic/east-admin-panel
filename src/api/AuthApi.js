import baseUrl from '@/api/config.js';
import UseRequestAdapters from '@/services/util/UseRequestAdapters.js';
import buildGetURL from '@/services/util/UseGetParametersBuilder.js';
import fetchToServer from '@/services/util/UseFetchToServer.ts';



export default (() => {
    return {
        ...UseRequestAdapters,
        _requestData : {},

        async login(requestData){
            let request = {
                body: JSON.stringify({...requestData, ...this._requestData}),
                headers: { 'Content-Type': 'application/json' },
            };

            return  await fetchToServer(baseUrl + '/api/auth/signin', request);
        },
        async register(requestData){
            let request = {
                body: JSON.stringify({...requestData, ...this._requestData}),
                headers: { 'Content-Type': 'application/json' },
            };

            return  await fetchToServer(baseUrl + '/api/auth/signup', request);
        },



    }

})();
