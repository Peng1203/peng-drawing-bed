import { createApp } from 'vue'
import './style.css'
import "tailwindcss/tailwind.css"
import App from './App.vue'



const app = createApp(App)

app.directive('hidden', {
  mounted(el, binding) {
    if (binding.value) el.style.opacity = '1'
    else el.style.opacity = '0'
  },
  updated(el, binding) {
    if (binding.value) el.style.opacity = '1'
    else el.style.opacity = '0'
  }
});

app.mount('#app')
