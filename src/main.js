import { createApp,h } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/global.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.mount('#app')