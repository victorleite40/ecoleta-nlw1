import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.0.8:3333'
});

export const apiIbge = axios.create({
    baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
});

export default api;