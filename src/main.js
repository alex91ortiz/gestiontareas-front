import Vue from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config/';

import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputMask from 'primevue/inputmask';
import Password from 'primevue/password';
import MegaMenu from 'primevue/megamenu';
import Message from 'primevue/message';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup'; 
import Toolbar from 'primevue/toolbar';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import Calendar from 'primevue/calendar';
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import SelectButton from 'primevue/selectbutton';
import Checkbox from 'primevue/checkbox';
import ToggleButton from 'primevue/togglebutton';
import InputSwitch from 'primevue/inputswitch';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

import 'primeflex/primeflex.css';
Vue.config.productionTip = false


Vue.use(PrimeVue);

Vue.component('Card',Card);
Vue.component('Button',Button);
Vue.component('InputText',InputText);
Vue.component('InputMask',InputMask);
Vue.component('Password',Password);
Vue.component('Message',Message);
Vue.component('MegaMenu',MegaMenu);

Vue.component('DataTable',DataTable);
Vue.component('Column',Column);
Vue.component('ColumnGroup',ColumnGroup);
Vue.component('Toolbar', Toolbar);
Vue.component('Dialog', Dialog);
Vue.component('Textarea', Textarea);
Vue.component('Calendar', Calendar);
Vue.component('Toast', Toast);
Vue.component('SelectButton', SelectButton);
Vue.component('Checkbox', Checkbox);
Vue.component('ToggleButton', ToggleButton);
Vue.component('InputSwitch', InputSwitch);
Vue.use(ToastService);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
