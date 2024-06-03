import axios from "axios";
const baseBackendUrl:string = 'http://localhost:8000';
// const baseBackendUrl:string = 'https://cp29bd07-8000.inc1.devtunnels.ms';

const API = axios.create({ baseURL: baseBackendUrl });

export { baseBackendUrl,API };