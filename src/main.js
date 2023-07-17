import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

Array.prototype.random = function () {
    return this[Math.floor((Math.random() * this.length))];
}

createApp(App).mount('#app')
