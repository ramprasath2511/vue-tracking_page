import { createApp } from 'vue'

import '@fontsource/poppins/400.css'
import '@fontsource/poppins/500.css'
import '@fontsource/poppins/600.css'
import '@fontsource/poppins/700.css'
import '@fontsource/roboto/400.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import './assets/styles/variables.css'
import './assets/styles/base.css'

import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
