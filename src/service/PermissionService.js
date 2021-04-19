import axios from 'axios';

export default class PermissionService {

    modules =[
        {'id':1,'modulo' : 'USUARIOS', 'crear' : false, 'modificar' : false, 'borrar' : false, 'consultar' : false, 'user_id' : ""},
        {'id':2,'modulo' : 'TAREAS', 'crear' : false, 'modificar' : false, 'borrar' : false, 'consultar' : false, 'user_id' : ""}
    ]
    header = {};
    constructor() {
        axios.defaults.withCredentials = true;
        axios.defaults.baseURL = "https://gestiontareas-jorge.herokuapp.com";
        let token = localStorage.getItem('user-token');
        this.header = { headers: {'Authorization': 'Bearer ' + token, "Content-type": "application/json"}};
    }

    getModules(){
        return this.modules;
    }

    getAll() {
        return axios.get(`/api/permisos`, this.header);
    }

    getByUser(id) {
        return axios.get(`/api/permisos/mostrar/${id}`, this.header);
    }

    create(data) {
        return axios.post("/api/permisos/crear", data, this.header);
    }

}