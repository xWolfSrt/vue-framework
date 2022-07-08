import { createApp } from 'vue'
import App from './App.vue'
import Vant from 'vant'
import 'vant/lib/index.css'
import './assets/js/responsive'
import './assets/js/organization'
import router from './router'
import storage from './utils/localstorage'
import http from './utils/http/httpclient.js'

const app = createApp(App)
app.use(Vant)
app.use(router)

app.config.globalProperties.$http = http
app.config.globalProperties.$router = router
app.config.globalProperties.$storage = storage
app.mount('#app')
