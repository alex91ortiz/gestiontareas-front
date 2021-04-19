import axios from 'axios';

export default class TaskService {

    
    header = {};
    constructor() {
        axios.defaults.withCredentials = true;
        axios.defaults.baseURL = "https://gestiontareas-jorge.herokuapp.com";
        let token = localStorage.getItem('user-token');
        this.header = { headers: {'Authorization': 'Bearer ' + token, "Content-type": "application/json"}};
    }

    getAll() {
        return axios.get(`/api/usuarios`, this.header);
    }

    create(data) {
        return axios.post("/api/usuarios/crear", data, this.header);
    }

    update(id, data) {
        return axios.put(`/api/usuarios/actualizar/${id}`, data, this.header);
    }

    delete(id) {
        return axios.delete(`/api/usuarios/borrar/${id}`, this.header);
    }

    findByTitle(title) {
        return axios.get(`/api/usuarios?title=${title}`, this.header);
    }
}