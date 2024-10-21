import axios from "axios"
export const API_BASE_URL = "http://localhost:5454/v1"
const token=localStorage.getItem("token")

export const api=axios.create({
    baseURL: API_BASE_URL,
    headers:{
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"


    }
})

export const api1 = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        
        "Content-Type": "application/json"
    }
});
