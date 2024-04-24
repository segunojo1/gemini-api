import axios from "axios";
const API_KEY = import.meta.env.VITE_GEMINI_KEY

export default axios.create({
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/models',
    params: {
        key: API_KEY
    }
})