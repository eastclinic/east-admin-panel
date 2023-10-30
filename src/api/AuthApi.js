import baseUrl from '@/api/config.js';
import UseRequestAdapters from '@/services/util/UseRequestAdapters.js';
import buildGetURL from '@/services/util/UseGetParametersBuilder.js';
import {postToServer} from '@/services/util/UseFetchToServer.ts';



export default (() => {
    return {
        ...UseRequestAdapters,
        _requestData : {},

        async login(requestData){
            return  postToServer(baseUrl + '/api/auth/login', {...requestData, ...this._requestData});
        },
        async register(requestData){
            return  await postToServer(baseUrl + '/api/auth/register', {...requestData, ...this._requestData});
        },



    }

})();
