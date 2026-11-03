import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import {auth} from '../firebase.js';

const routes: RouteRecordRaw[] =[
    {
        path: '/',
        alias: '/connexion',
        component: () => import('../view/Connexion.vue'),
    },
    {
        path: '/create-ticket',
        alias: '/connexion',
        component: () => import('../view/CreateTicket.vue'),
    },
    {
        path: '/',
        alias: '/connexion',
        component: () => import('../view/Analytics.vue'),
    },
    {
        path: '/',
        alias: '/liste-ticket',
        component: () => import('../view/ListTicket.vue'),
    },
    {
        path: '/create-compte',
        alias: '/register',
        component: () => import('../view/RegisterForm.vue'),
    },
    {
        path: '/dashbord',
        alias: '/dashbord',
        component: () => import('../view/Dashbord.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to) => {
    await auth.authStateReady();
    
    const currentUser = auth.currentUser;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    if (requiresAuth && !currentUser) {
        return { name: 'login' };
    }
    if ((to.name === 'login' || to.name === 'register') && currentUser) {
        return { name: 'dashboard' };
    }
});

export default router;