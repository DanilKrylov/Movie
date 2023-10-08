import jwt_decode from 'jwt-decode'
import { $authHost, $host } from './httpService';

export const registration = async (data) => {
    const response = (await $host.post('Auth/registerCinema', data)).data
    return response;
}

export const login = async (data) => {
    const response = (await $host.post('Auth/login', data)).data
    return response;
}

export const check = async () =>{
    try{
        await $authHost.post('Auth/checkSignIn')
    }
    catch{
        return false;
    }

    return mapJwtClaims(jwt_decode(localStorage.getItem('token')))
}


function mapJwtClaims(jwtClaims) {
    const mapping = {
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "login"
    };

    const result = {};
    for (const key in jwtClaims) {
        const mappedKey = mapping[key] || key;
        result[mappedKey] = jwtClaims[key];
    }
    return result;
}