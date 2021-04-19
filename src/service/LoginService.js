import axios from 'axios';

export default class LoginService {

    
    header = {};
    constructor() {
        axios.defaults.withCredentials = true;
        axios.defaults.baseURL = "https://gestiontareas-jorge.herokuapp.com";
        let token = localStorage.getItem('user-token');
        this.header = { headers: {'Authorization': 'Bearer ' + token, "Content-type": "application/json"}};
    }
    
    logout() {
        return axios.post("/api/salir", this.header);
    }
}