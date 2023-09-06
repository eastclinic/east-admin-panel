import baseUrl from '@/api/config.js';
import UseGetParametersBuilder from '@/services/util/UseGetParametersBuilder.js';

export default (() => ({
    ...UseGetParametersBuilder,
    async fetchServerData( url, requestData ){
    //if(!fileList || fileList.length === 0) return {}
        if(url[0] !== '/') url = '/' + url;
        let requestUrl = baseUrl+url;
        if( requestData &&  Object.keys(requestData).length > 0 ){
            requestUrl = this.buildGetURL(requestUrl, requestData)
        }

        try {
            const res = await fetch(requestUrl, {method:'GET'});
            if(!res) return {};
            const data = await res.json()
            if(!data || !data.items) return {};
            return data;
        } catch (error) {
            // code to handle the error
            console.log("An error occurred:", error.message);
        }

    return {};


},

    }))();
