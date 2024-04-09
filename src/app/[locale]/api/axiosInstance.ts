import axios from "axios";

const BASE_URL = 'https://aydym.com/api/v1'
const axiosInstance = axios.create({
    baseURL: BASE_URL,
});
export {
    BASE_URL,
    axiosInstance, 
}