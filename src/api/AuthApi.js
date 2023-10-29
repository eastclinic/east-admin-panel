import baseUrl from '@/api/config.js';
import UseRequestAdapters from '@/services/util/UseRequestAdapters.js';
import buildGetURL from '@/services/util/UseGetParametersBuilder.js';
import fetchToServer from '@/services/util/UseFetchToServer.js';



export default (() => {
    let _url = '/api/doctors';
    return {
        ...UseRequestAdapters,
        _requestData : {},

        async login(requestData){
            let request = {method:'GET'}
            if (_url[0] !== '/') _url = '/'+_url;
            // Create the URL with the parameters
            const requestUrl = buildGetURL(baseUrl + _url, requestData)

            const res = await fetchToServer(requestUrl, request);
            if(!res) return {};
            const data = await res.json()
            if(!data || !data.items) return {};
            return data;
        },



    }
})();
