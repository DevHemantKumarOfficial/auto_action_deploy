import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.URL,
    withCredentials: true,
});

export default axiosInstance;