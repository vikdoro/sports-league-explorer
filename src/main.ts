import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';

createApp(App).use(createPinia()).mount('#app');
