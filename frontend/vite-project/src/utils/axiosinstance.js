import axios from "axios";
import {BASE_URL} from "./apiPaths";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 1000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if(accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);

    }
);
//response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;

    },
    (error) => {
        // handlle common error
        if (error.response) {
            if(error.response.status === 401){
                //redirect to login page
                window.location.href = "/login";

            }else if (error.code === "ECONNABORATED"){
                console.error("Server error. ");
            }
            return Promise.reject(error);
        }
    }
);
export default axiosInstance;