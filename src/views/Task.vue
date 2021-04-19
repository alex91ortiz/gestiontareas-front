<template>
  <div class="task">
    <Navigation />
    <Toast position="top-left" group="tl" />
    <div>
      <div class="card">
        <DataTable
          ref="dt"
          :value="tasks"
          v-model="tasks"
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
                label="Nueva"
                icon="pi pi-plus"
                class="p-button-primary p-mr-2"
                v-if="security.crear"
                @click="openNew"
              />
              <div class="p-input-icon-center" v-if="security.consultar">
                <ToggleButton
                  v-model="finished"
                  @change="filterQuery"
                  onLabel="Finalizadas"
                  offLabel="Activas"
                />
                <ToggleButton
                  v-model="alltask"
                  @change="filterQuery"
                  onLabel="Todos"
                  offLabel="Mias"
                />
              </div>
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
            field="nombre"
            header="Nombre"
            :sortable="true"
            style="min-width:8rem"
          ></Column>
          <Column
            field="descripcion"
            header="Descripcion"
            :sortable="true"
            style="min-width:16rem"
          ></Column>
          <Column
            field="fechavencimiento"
            header="Fecha Vencimiento"
            :sortable="true"
            dataType="date"
            style="min-width:10rem"
          ></Column>
          <Column
            field="estado"
            header="Estado"
            :sortable="true"
            style="min-width:5rem"
          >
            <template #body="slotProps">
              <span
                :class="
                  'task-badge status-' +
                    (slotProps.data.estado
                      ? slotProps.data.estado.toLowerCase()
                      : '')
                "
                >{{ slotProps.data.estado == "N" ? "Activa" : "Finalizado" }}
              </span>
            </template>
          </Column>
          <Column :exportable="false">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-info p-mr-2"
                v-if="security.modificar"
                @click="edittask(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-warning"
                v-if="security.borrar"
                @click="confirmDeletetask(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>
      </div>

      <Dialog
        :visible="taskDialog"
        :style="{ width: '450px' }"
        header="Tarea"
        :modal="true"
        class="p-fluid"
      >
        <div class="p-fluid p-column p-formgrid">
          <div class="p-field">
            <label for="name">Nombre</label>
            <InputText
              id="name"
              v-model="task.nombre"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !task.nombre }"
            />
            <small class="p-error" v-if="submitted && !task.nombre"
              >Nombre es requerida.</small
            >
          </div>
          <div class="p-field">
            <label for="description">Description</label>
            <Textarea
              id="description"
              v-model="task.descripcion"
              required="true"
              rows="3"
              cols="20"
              :class="{ 'p-invalid': submitted && !task.descripcion }"
            />
            <small class="p-error" v-if="submitted && !task.descripcion"
              >Descripci&oacute;n es requerida.</small
            >
          </div>
          <div class="p-field">
            <label for="fechavencimiento">Fecha Vencimiento</label>
            <Calendar
              id="fechavencimiento"
              v-model="task.fechavencimiento"
              required="true"
              dateFormat="yy-mm-dd"
              :class="{ 'p-invalid': submitted && !task.fechavencimiento }"
            />
            <small class="p-error" v-if="submitted && !task.fechavencimiento"
              >Fecha es requerida.</small
            >
          </div>
          <div class="p-field">
            <div class="p-fluid p-formgrid p-column">
              <div class="p-field p-col">Finalizar</div>
              <div class="p-field p-col">
                <InputSwitch id="estado" v-model="status" />
              </div>
            </div>
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
            @click="savetask"
          />
        </template>
      </Dialog>

      <Dialog
        v-model="deletetaskDialog"
        :visible="deletetaskDialog"
        :style="{ width: '450px' }"
        header="Confirmar"
        :modal="true"
      >
        <div class="confirmation-content">
          <i
            class="pi pi-exclamation-triangle p-mr-3"
            style="font-size: 2rem"
          />
          <span v-if="task"
            >Estas seguro de eliminar la tarea <b>{{ task.name }}</b
            >?</span
          >
        </div>
        <template #footer>
          <Button
            label="No"
            icon="pi pi-times"
            class="p-button-text"
            @click="deletetaskDialog = false"
          />
          <Button
            label="Si"
            icon="pi pi-check"
            class="p-button-text"
            @click="deletetask"
          />
        </template>
      </Dialog>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Navigation from "@/components/navigation";
import TaskService from "@/service/TaskService";
import PermissionService from "@/service/PermissionService";
const modulo = "TAREAS";
export default {
  name: "Task",
  components: {
    Navigation,
  },
  data: () => ({
    tasks: null,
    taskDialog: false,
    deletetaskDialog: false,
    deletetasksDialog: false,
    security: {},
    task: {},
    selectedtasks: null,
    taskService: null,
    permissionService: null,
    filters: {},
    status: false,
    finished: false,
    alltask: false,

    submitted: false,
  }),
  created() {
    this.taskService = new TaskService();
    this.permissionService = new PermissionService();
    this.permissionService.getAll().then((res) => {
      const permissions = res.data.data;
      for (let p in permissions) {
        if (permissions[p].modulo == modulo) {
          this.security = permissions[p];
        }
      }
    });
  },
  mounted() {
    this.retrieveTask();
  },
  methods: {
    retrieveTask() {
      this.taskService.getAll().then((res) => {
        this.tasks = res.data.data;
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
      this.task = {};
      this.submitted = false;
      this.taskDialog = true;
    },
    hideDialog() {
      this.taskDialog = false;
      this.submitted = false;
    },
    savetask() {
      this.submitted = true;
      this.task.estado = this.status ? "S" : "N";
      let year = this.task.fechavencimiento.getFullYear();
      let month = (this.task.fechavencimiento.getMonth() + 1);
      let day = this.task.fechavencimiento.getDate();
      this.task.fechavencimiento =  year + "-" + ((month > 9)? month: "0"+month) + "-" + ((day > 9)? day: "0"+day);
      if (this.task.nombre.trim()) {
        if (this.task.id) {
          this.$set(this.tasks, this.findIndexById(this.task.id), this.task);
          this.taskService
            .update(this.task.id, this.task)
            .then((res) => {
              console.log(res);
              this.$toast.add({
                severity: "success",
                summary: "Successful",
                detail: "Tarea Actualizada",
                life: 3000,
              });
            })
            .catch((err) => console.log(err));
        } else {
          this.tasks.push(this.task);

          let data = this.task;
          this.taskService.create(data).then(() => {
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "Tarea Creada",
              life: 3000,
            });
          });
        }
        this.taskDialog = false;
        this.task = {};
      }
    },
    edittask(task) {
      this.task = { ...task };
      this.taskDialog = true;
      this.status = this.task.estado == "S" ? true : false;
    },
    confirmDeletetask(task) {
      this.task = task;
      this.deletetaskDialog = true;
    },
    deletetask() {
      this.tasks = this.tasks.filter((val) => val.id !== this.task.id);
      this.deletetaskDialog = false;

      this.$toast.add({
        severity: "success",
        summary: "Successful",
        detail: "task Deleted",
        life: 3000,
      });
      this.taskService.delete(this.task.id).then(() => {});
      this.task = {};
    },
    confirmDeleteSelected() {
      this.deletetasksDialog = true;
    },
    findIndexById(id) {
      return this.tasks.findIndex((ne) => ne.id == id);
    },
    filterQuery() {
      let query = "";
      if (this.finished) {
        query += "?estado=S";
      } else {
        query += "?estado=N";
      }
      if (!this.alltask) {
        query += "&user_id=S";
      }
      this.taskService.filterQuery(query).then((res) => {
        this.tasks = res.data.data;
      });
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
</style>
