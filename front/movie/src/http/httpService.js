import axios from "axios";

const $host = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL + '/api',
    headers: {
        "Content-type": "application/json"
    }
});

const $authHost = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL + '/api',
    headers: {
        "Content-type": "application/json"
    }
})
const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    console.log(config.headers.authorization)
    return config
}

$authHost.interceptors.request.use(authInterceptor)

export {
    $host,
    $authHost
}