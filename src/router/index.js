import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import Splash from '@/views/Splash.vue'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'

const routes = [
    { path: '/', redirect: '/splash' },
    { path: '/splash', component: Splash },
    { path: '/login', component: Login },
    { path: '/home', component: Home },
]

const router = createRouter({
    routes,
    // history: createWebHashHistory(),
    history: createWebHistory(),
})

export default router
