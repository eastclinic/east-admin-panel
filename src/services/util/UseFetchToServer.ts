
function addJwtToken(options?: RequestInit){
    if(localStorage.getItem('jwtToken')){
        const headers = options?.headers ? new Headers(options.headers) : new Headers();
        headers.set('Authorization','Bearer ' + localStorage.getItem('jwtToken'));
        options.headers = headers;
    }
    return options;
}

async function fetchToServer<T>(url: string, options?: RequestInit) {
    try {
        options = addJwtToken(options);

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }

        const data = await response.json();
        return data as T;
    } catch (error) {
        throw new Error(`Fetch error: ${error.message}`);
    }
}
export default fetchToServer;
