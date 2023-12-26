
const isDeploy = process.env.NODE_ENV === 'production'; // Using Node.js environment variable to check if it's in production mode

const baseUrl = isDeploy ? 'https://eastclinic.ru' : 'http://127.0.0.1:8000';

export default baseUrl
