// src/middleware/auth.js
import authService from '../../services/Profile/AuthService';


export default function auth({ next, router }) {
    if (!authService.isAuth()) {
        console.log(11111111111)
        return next({
            name: 'login'
        })
        // return router.push({ name: 'login' });
    }

    return next();
}
