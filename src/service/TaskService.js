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
        return axios.get(`/api/tareas`, this.header);
    }

    getId(id) {

        return axios.get(`/api/tareas/mostrar/${id}`, this.header);
    }
    create(data) {
        return axios.post("/api/tareas/crear", data, this.header);
    }

    update(id, data) {
        return axios.put(`/api/tareas/actualizar/${id}`, data, this.header);
    }

    delete(id) {
        return axios.delete(`/api/tareas/borrar/${id}`, this.header);
    }

    filterQuery(data) {
        return axios.get(`/api/tareas/consultar${data}`, this.header);
    }
}