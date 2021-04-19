<template>
  <div class="p-grid">
    <div class="p-col-12 p-md-4 p-lg-4 p-md-offset-4 ">
      <form @submit.prevent="login">
        <Card>
          <template #header>
            <img
              alt="user header"
              src="../assets/logo.png"
              style="width:50px"
            />
          </template>
          <template #title>
            Gestion de Tareas
          </template>
          <template #content>
            <div class="p-fluid p-formgrid p-column">
              <div class="p-field p-col">
                <label for="email">Correo Electronico</label>
                <InputText
                  id="email"
                  v-model="form.email"
                  class="p-mb-2 p-d-block"
                  placeholder="Ingrese correo"
                />
              </div>
              <div class="p-field p-col">
                <label for="password">Contraseña</label>
                <Password
                  id="password"
                  v-model="form.password"
                  class="p-d-block"
                  placeholder="Ingrese Contraseña"
                />
              </div>
            </div>
            <Message v-if="!validate"  severity="error">{{ message }}</Message>
          </template>
          <template #footer>
            
            <Button
              v-if="form.email.length > 0 && form.password.length > 0"
              type="submit"
              icon="pi pi-check"
              label="Ingresar"
            />
            <Button
              v-if="form.email.length <= 0 || form.password.length <= 0"
              type="submit"
              disabled="disabled"
              icon="pi pi-check"
              label="Ingresar"
            />
          </template>
        </Card>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://gestiontareas-jorge.herokuapp.com";

export default {
  data: () => ({
    user: {},
    validate: true,
    message: "",
    form: {
      email: "",
      password: "",
    },
  }),
  created() {},
  methods: {
    login() {
      this.validate = true;
      axios
        .get("/sanctum/csrf-cookie/")
        .then(() => {
          axios
            .post("/api/login", this.form)
            .then((res) => {
              this.user = res.data.data;
              localStorage.setItem("user-token", this.user.token);
              localStorage.setItem("user-name", this.user.nombre);
              window.location.href = "/";
            })
            .catch((error) =>{
              if (error.response.status == 404) {
                this.validate = error.response.data.success;
                this.message = error.response.data.message;
              }
            });
        });
    },
  },
};
</script>

<style></style>
