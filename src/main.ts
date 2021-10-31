import { createApp, reactive } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Notifications, { Provider } from '@/components/notifications';

const app = createApp(App);

app.component('notification-provider', Provider);
app.config.globalProperties.$notifications = reactive(new Notifications());

app.use(store).use(router).mount('#geohelper');
