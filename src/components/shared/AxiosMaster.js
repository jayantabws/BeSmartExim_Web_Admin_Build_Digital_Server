import axios from 'axios';
import * as AppConstant from './AppConstant';

const instance = axios.create({
    baseURL: AppConstant.MASTER_API_URL
});

// Add a request interceptor
instance.interceptors.request.use(config => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
        config.headers['accessedBy'] = userId;
    }
    else config.headers['accessedBy'] = 1
    
    return config;
}, error => {
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.reject(error.response);
});

export default instance;