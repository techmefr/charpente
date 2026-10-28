import "vuetify/styles"
import "virtual:charpente.css"
import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import { createVuetify } from "vuetify"
import App from "./App.vue"
import Simple from "./pages/Simple.vue"
import Complex from "./pages/Complex.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/simple" },
    { path: "/simple", component: Simple },
    { path: "/complex", component: Complex },
  ],
})

createApp(App).use(router).use(createVuetify()).mount("#app")
