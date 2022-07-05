import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import Splash from '@/views/Splash.vue'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import PersonalRoot from '@/views/personal/PersonalRoot.vue'
import Personal from '@/views/personal/Personal.vue'
import PersonalDetails from '@/views/personal/PersonalDetails.vue'
import PersonalSettings from '@/views/personal/PersonalSettings.vue'
// import NotFound from '@/views/NotFound.vue'

const routes = [
    { path: '/', redirect: '/splash' },
    { path: '/splash', component: Splash },
    { path: '/login', component: Login },
    { path: '/home', component: Home },
    {
        path: '/personal',
        component: PersonalRoot,
        children: [
            { path: '', component: Personal },
            { path: 'details', component: PersonalDetails },
            { path: 'settings', component: PersonalSettings },
        ],
    },
    {
        path: '/:error*', // /:error -> 匹配 /, /one, /one/two, /one/two/three, 等
        name: '404',
        component: () => import('@/views/NotFound.vue'),
    },
]

const router = createRouter({
    routes,
    // history: createWebHashHistory(),
    history: createWebHistory(),
})

export default router
