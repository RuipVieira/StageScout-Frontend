import { createApp,h } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/global.css'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"
import { NConfigProvider } from 'naive-ui'

const app = createApp({
  render: () =>
    h(NConfigProvider, null, {
      default: () => h(App)
    })
})

app.use(router)
app.mount('#app')