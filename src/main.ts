import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/iconfont/font.css'
import ElementPlus from 'element-plus'
// import 'element-plus/es/components/message/style/css'
import 'element-plus/dist/index.css'
// import {ElButton} from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
app.use(router)
app.use(ElementPlus)
// app.use(pinia)
// app.use(ElButton)
// app.use(store)
app.mount('#app')
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
