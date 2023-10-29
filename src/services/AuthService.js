import authApi from '../api/AuthApi'

class AuthService {
    async login(user) {
        await authApi.login(user)
    }

    logout() {
        localStorage.removeItem('jwtToken');
    }

    async register(user) {
        await authApi.register(user)
    }
    isAuth(){
        return false;
        return (localStorage.getItem('jwtToken'));
    }
}

export default new AuthService();
