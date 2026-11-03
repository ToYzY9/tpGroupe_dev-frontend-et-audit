import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] =[
    {
        path: '/',
        alias: '/connexion',
        component: () => import('../view/Connexion.vue'),
    },
    {
        path: '/create-ticket',
        alias: '/create-ticket',
        component: () => import('../view/CreateTicket.vue'),
    },
    {
        path: '/analytics',
        alias: '/analytics',
        component: () => import('../view/Analytics.vue'),
    },
    {
        path: '/liste-ticket',
        alias: '/liste-ticket',
        component: () => import('../view/ListTicket.vue'),
    },
    {
        path: '/create-account',
        alias: '/create-account',
        component: () => import('../view/CreateAccount.vue'),
    },
    {
        path: '/dashboard',
        alias: '/dashboard',
        component: () => import('../view/Dashboard.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;