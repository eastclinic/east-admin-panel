import baseUrl from '@/api/config.js';
import UseRequestAdapters from '@/services/util/UseRequestAdapters.js';
import buildGetURL from '@/services/util/UseGetParametersBuilder.js';
import {postToServer} from '@/services/util/UseFetchToServer.ts';



export default (() => {
    return {
        ...UseRequestAdapters,
        _requestData : {},

        async login(requestData){
            console.log(requestData)
            return  await postToServer(baseUrl + '/api/auth/signin', {...requestData, ...this._requestData});
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
