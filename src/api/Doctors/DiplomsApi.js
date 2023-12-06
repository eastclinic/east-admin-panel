import baseUrl from '@/api/config.js';
import UseRequestAdapters from '@/services/util/UseRequestAdapters.js';
import buildGetURL from '@/services/util/UseGetParametersBuilder.js';
import {getToServer} from '@/services/util/UseFetchToServer';


export default (() => {
    let _url = '/api/doctor-diploms';
    return {
        ...UseRequestAdapters,
        _requestData : {},

        async get(requestData){
            return await getToServer(baseUrl + _url, {...requestData, ...this._requestData});
        },
        async saveItem( saveData ){
            if(!saveData || Object.keys(saveData).length === 0) return {}
            let request = {
                body: JSON.stringify(saveData),
                headers: {
                    'Content-Type': 'application/json'
                },
            };
            let url = baseUrl + _url;
            if(saveData.id ) {
                request['method'] = 'PUT';
                url += '/' + saveData.id;
            }else {
                //if not have id - its create new review
                request['method'] = 'POST';
            }
            try {
                const res = await fetch(url, request);
                //todo handle server error (500, 502 ...)
                if(!res) return {};
                return await res.json()
            } catch (error) {
                // code to handle the error
                console.log("An error occurred:", error.message);
            }
            return {};


        },

        async deleteDoctor(id){
            let url = baseUrl + '/api/doctors/'+id;
            const request = {
                headers: {
                    'Content-Type': 'application/json'
                },
                method : 'DELETE'
            };
            try {
                const res = await fetch(url, request);
                //todo handle server error (500, 502 ...)
                if(!res) return {};
                return await res.json()
            } catch (error) {
                // code to handle the error
                console.log("An error occurred:", error.message);
            }
            return {};
        },
        withUrl(url){
            if(url) _url = url;
            return this;
        },


    }
})();