import axios from "axios";
// const baseBackendUrl:string = 'http://localhost:8000';
const baseBackendUrl:string = 'https://blog-web-4yaz.onrender.com';

const API = axios.create({ baseURL: baseBackendUrl });

export { baseBackendUrl,API };