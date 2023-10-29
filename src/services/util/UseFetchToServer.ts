
function addJwtTokenToRequest(options?: RequestInit){
    if(localStorage.getItem('jwtToken')){
        const headers = options?.headers ? new Headers(options.headers) : new Headers();
        headers.set('Authorization','Bearer ' + localStorage.getItem('jwtToken'));
        options.headers = headers;
    }
    return options;
}

function saveJWTToken(data){
    //todo fill right jwt token string from server response format
    if(data?.jwtToken){
        localStorage.setItem('jwtToken', data.jwtToken);
    }
}

async function fetchToServer<T>(url: string, options?: RequestInit) {
    try {
        options = addJwtTokenToRequest(options);

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }

        const data = await response.json();
        saveJWTToken(data);
        return data as T;
    } catch (error) {
        throw new Error(`Fetch error: ${error.message}`);
    }
}
export default fetchToServer;
