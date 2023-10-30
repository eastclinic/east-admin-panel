import authApi from '../../api/AuthApi'

class AuthService {
    async login(authData) {
        await authApi.login(authData)
    }

    logout() {
        localStorage.removeItem('jwtToken');
    }

    async register(user) {
        await authApi.register(user)
    }
    isAuth(){
        return true;
        return (localStorage.getItem('jwtToken'));
    }
}

export default new AuthService();
