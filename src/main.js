import "./assets/main.css";
import "bootstrap/dist/css/bootstrap.css";
import { createApp } from "vue";
import App from "./App.vue";
import "bootstrap/dist/js/bootstrap.js";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";
import { useStore } from 'vuex';
import { store } from './store/index';

export default {
    setup(){
        const store = useStore();
    }
}

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

const app = createApp(App);
app.use(router);
app.use (store)
app.mount("#app");