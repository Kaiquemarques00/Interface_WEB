import axios from 'axios'

const api = axios.create({
    baseURL: 'https://api-pim.onrender.com'
});

export default api