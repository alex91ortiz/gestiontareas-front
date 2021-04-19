<template>
  <div class="user">
    <Navigation />
    <Toast position="top-left" group="tl" />
    <div>
      <div class="card">
        <DataTable
          ref="dt"
          :value="users"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Mostrar {first} hasta {last} de {totalRecords} tareas"
          responsiveLayout="scroll"
        >
          <template #header>
            <div class="table-header">
              <Button
                label="Nuevo"
                icon="pi pi-plus"
                v-if="security.crear"
                class="p-button-primary p-mr-2"
                @click="openNew"
              />

              <h5 class="p-m-0">Consultar tareas</h5>
              <span class="p-input-icon-left" v-if="security.consultar">
                <i class="pi pi-search" />
                <InputText
                  
                  v-model="filters['global']"
                  placeholder="Search..."
                />
              </span>
            </div>
          </template>

          <Column
            field="name"
            header="Nombre"
            :sortable="true"
            style="min-width:8rem"
          ></Column>
          <Column
            field="email"
            header="Correo"
            :sortable="true"
            style="min-width:16rem"
          ></Column>
          <Column
            field="administrador"
            header="Administrador"
            :sortable="true"
            style="min-width:5rem"
          >
            <template #body="slotProps">
              <span
                :class="
                  'user-badge status-' +
                    (slotProps.data.estado
                      ? slotProps.data.estado.toLowerCase()
                      : '')
                "
                >{{ slotProps.data.administrador ? "Si" : "No" }}
              </span>
            </template>
          </Column>
          <Column :exportable="false">
            <template #body="slotProps">
              <Button
                icon="pi pi-lock"
                class="p-button-rounded p-button-info p-mr-2"
                v-if="security.modificar"
                @click="editPermission(slotProps.data)"
              />
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-info p-mr-2"
                v-if="security.modificar"
                @click="edituser(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-warning"
                v-if="security.borrar"
                @click="confirmDeleteuser(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>

      <Dialog
        :visible="userDialog"
        :style="{ width: '450px' }"
        header="Usuario"
        :modal="true"
        class="p-fluid"
      >
        <div class="p-fluid p-column p-formgrid">
          <div class="p-field">
            <label for="name">Nombre</label>
            <InputText
              id="name"
              v-model="user.name"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !user.name }"
            />
            <small class="p-error" v-if="submitted && !user.name"
              >Nombre es requerida.</small
            >
          </div>
          <div class="p-field">
            <label for="email">Correo</label>
            <InputText
              id="email"
              v-model="user.email"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !user.email }"
            />
            <small class="p-error" v-if="submitted && !user.email"
              >Correo es requerido.</small
            >
          </div>
          <div class="p-field p-col">
            <label for="administrador">Es administrador?</label>
            <SelectButton
              v-model="user.administrador"
              :options="options"
              id="administrador"
              optionLabel="name"
              :class="{ 'p-invalid': submitted && !user.administrador }"
            />
            <small class="p-error" v-if="submitted && !user.administrador"
              >Tipo de usuario es requerido.</small
            >
          </div>
          <div class="p-field p-col">
            <label for="password">Contraseña</label>
            <Password
              id="password"
              v-model="user.password"
              class="p-d-block"
              placeholder="Ingrese Contraseña"
              :class="{
                'p-invalid':
                  submitted && !user.password && requesttype.value == 1,
              }"
            />
            <small
              class="p-error"
              v-if="submitted && !user.password && requesttype.value == 1"
              >Contraseña es requerida.</small
            >
          </div>
          <div class="p-field p-col">
            <label for="password">Confirmar Contraseña</label>
            <Password
              id="password"
              v-model="user.confirmation_password"
              class="p-d-block"
              placeholder="Ingrese Contraseña"
              :class="{
                'p-invalid':
                  submitted &&
                  !user.confirmation_password &&
                  requesttype.value == 1,
              }"
            />
            <small
              class="p-error"
              v-if="
                submitted &&
                  !user.confirmation_password &&
                  requesttype.value == 1
              "
              >Confirmacion de contraseña es requerida.</small
            >
          </div>
        </div>

        <template #footer>
          <Button
            label="Cancelar"
            icon="pi pi-times"
            class="p-button-text"
            @click="hideDialog"
          />
          <Button
            label="Guardar"
            icon="pi pi-check"
            class="p-button-text"
            @click="saveuser"
          />
        </template>
      </Dialog>

      <Dialog
        :visible="userDialogPermits"
        :style="{ width: '450px' }"
        header="Permisos"
        :modal="true"
        class="p-fluid"
      >
        <table class="permission-table">
          <thead>
            <tr>
              <th>Modulo</th>
              <th>Crear</th>
              <th>Modificar</th>
              <th>Borrar</th>
              <th>Consultar</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in permissions" :key="item.id">
              <td>{{ item.modulo }}</td>
              <td>
                <ToggleButton
                  v-model="item.crear"
                  onIcon="pi pi-check"
                  offIcon="pi pi-times"
                />
              </td>
              <td>
                <ToggleButton
                  v-model="item.modificar"
                  onIcon="pi pi-check"
                  offIcon="pi pi-times"
                />
              </td>
              <td>
                <ToggleButton
                  v-model="item.borrar"
                  onIcon="pi pi-check"
                  offIcon="pi pi-times"
                />
              </td>
              <td>
                <ToggleButton
                  v-model="item.consultar"
                  onIcon="pi pi-check"
                  offIcon="pi pi-times"
                />
              </td>
            </tr>
          </tbody>
        </table>

        <template #footer>
          <Button
            label="Cancelar"
            icon="pi pi-times"
            class="p-button-text"
            @click="hideDialogPermits"
          />
          <Button
            label="Guardar"
            icon="pi pi-check"
            class="p-button-text"
            @click="savePermission"
          />
        </template>
      </Dialog>

      <Dialog
        v-model="deleteuserDialog"
        :visible="deleteuserDialog"
        :style="{ width: '450px' }"
        header="Confirmar"
        :modal="true"
      >
        <div class="confirmation-content">
          <i
            class="pi pi-exclamation-triangle p-mr-3"
            style="font-size: 2rem"
          />
          <span v-if="user"
            >Estas seguro de eliminar el usuario <b>{{ user.name }}</b
            >?</span
          >
        </div>
        <template #footer>
          <Button
            label="No"
            icon="pi pi-times"
            class="p-button-text"
            @click="deleteuserDialog = false"
          />
          <Button
            label="Si"
            icon="pi pi-check"
            class="p-button-text"
            @click="deleteuser"
          />
        </template>
      </Dialog>

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Navigation from "@/components/navigation";
import UserService from "@/service/UserService";
import PermissionService from "@/service/PermissionService";
const modulo = "USUARIOS";
export default {
  name: "User",
  components: {
    Navigation,
  },
  data: () => ({
    users: null,
    permissions: null,
    userDialog: false,
    deleteuserDialog: false,
    deleteusersDialog: false,
    userDialogPermits: false,
    user: {},
    permission: {},
    security: {},
    options: [
      { name: "Si", value: true },
      { name: "No", value: false },
    ],
    selectedusers: null,
    selectedPermission: null,
    userService: null,
    permissionService: null,
    filters: {},
    item: {},
    submitted: false,
    requesttype: { name: "", value: 0 },
    statuses: [
      { label: "INSTOCK", value: "S" },
      { label: "LOWSTOCK", value: "N" },
    ],
  }),
  created() {
    this.userService = new UserService();
    this.permissionService = new PermissionService();
  },
  mounted() {
    this.retrieveUser();
    this.permissionService.getAll().then((res) => {
      const permissions = res.data.data;
      for (let p in permissions) {
        if (permissions[p].modulo == modulo) {
          this.security = permissions[p];
        }
      }
    });
  },
  methods: {
    retrieveUser() {
      this.userService.getAll().then((res) => {
        this.users = res.data.data;
      });
    },
    retrievePermission() {
      /** consultamos la informacion registrada de los permisos y validamos frente a la estructura de datos definida */

      const permissionsDefault = new PermissionService().getModules();
      let permissions = [];
      this.permissionService.getByUser(this.user.id).then((res) => {
        const permissionsResult = res.data.data;
        if (permissionsResult && permissionsResult.length > 0) {
          permissions = permissionsDefault.map((data) => {
            for (let perm in permissionsResult) {
              if (permissionsResult[perm].modulo == data.modulo) {
                data.crear = permissionsResult[perm].crear;
                data.modificar = permissionsResult[perm].modificar;
                data.borrar = permissionsResult[perm].borrar;
                data.consultar = permissionsResult[perm].consultar;
              }
            }
            return data;
          });
        } else {
          permissionsDefault.map((data) => {
            permissions.push(data);
          });
        }
        this.permissions = permissions;
      });
    },
    formatCurrency(value) {
      if (value)
        return value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        });
      return;
    },
    openNew() {
      this.user = { administrador: { name: "No", value: false } };
      this.submitted = false;
      this.userDialog = true;
      this.requesttype.name = "Nuevo";
      this.requesttype.value = 1;
    },
    hideDialog() {
      this.userDialog = false;
      this.submitted = false;
    },
    hideDialogPermits() {
      this.userDialogPermits = false;
      this.submitted = false;
    },
    saveuser() {
      this.submitted = true;

      if (this.user.name.trim()) {
        this.user.administrador = this.user.administrador.value;
        if (this.user.id) {
          this.$set(this.users, this.findIndexById(this.user.id), this.user);
          this.userService.update(this.user.id, this.user).then(() => {
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "user Updated",
              life: 3000,
            });
            return true;
          });
        } else {
          this.users.push(this.user);
          let data = this.user;
          this.userService.create(data).then(() => {
            
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "user Created",
              life: 3000,
            });
          });
        }

        this.userDialog = false;
        this.user = {};
      }
    },
    savePermission() {
      this.permissionService
        .create({
          permisos: this.permissions,
          user_id: this.user.id,
        })
        .then(() => {
          this.$toast.add({
            severity: "success",
            summary: "Successful",
            detail: "permission Created",
            life: 3000,
          });
        });
      this.userDialogPermits = false;
    },
    editPermission(user) {
      this.user = { ...user };
      this.userDialogPermits = true;
      this.retrievePermission();
    },
    edituser(user) {
      this.user = { ...user };
      // formateamos el tipo de usuario tal como lo recibe el componente SelectButton
      this.user.administrador = this.options.find(
        (op) => op.value == this.user.administrador
      );
      this.userDialog = true;
      this.requesttype.name = "Editar";
      this.requesttype.value = 2;
    },
    confirmDeleteuser(user) {
      this.user = user;
      this.deleteuserDialog = true;
    },
    deleteuser() {
      this.users = this.users.filter((val) => val.id !== this.user.id);
      this.deleteuserDialog = false;

      this.$toast.add({
        severity: "success",
        summary: "Successful",
        detail: "user Deleted",
        life: 3000,
      });
      this.userService.delete(this.user.id).then(() => {});
      this.user = {};
    },
    confirmDeleteSelected() {
      this.deleteusersDialog = true;
    },
    findIndexById(id) {
      return this.users.findIndex((ne) => ne.id == id);
    },
  },
};
</script>
<style scoped>
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-image {
  width: 50px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .product-image {
  width: 50px;
  margin: 0 auto 2rem auto;
  display: block;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
.permission-table {
  padding: 10px;
}
.permission-table th {
  border: 1px gray;
}
</style>
