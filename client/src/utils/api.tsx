import axios from "axios";

const baseBackendUrl = 'https://blog-web-4yaz.onrender.com';

const API = axios.create({ baseURL: baseBackendUrl });

export { baseBackendUrl, API };
