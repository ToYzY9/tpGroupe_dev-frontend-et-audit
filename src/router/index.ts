import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] =[
    {
        path: '/',
        redirect: '/connexion',
    },
    {
        path: '/connexion',
        alias: '/connexion',
        name : 'login',
        component: () => import('../view/Connexion.vue'),
    },
    {
        path: '/create-ticket',
        name: 'ticket-create',
        alias: '/create-ticket',
        component: () => import('../view/CreateTicket.vue'),
    },
    {
        path: '/analytics',
        name: 'analytics',
        alias: '/analytics',
        component: () => import('../view/Analytics.vue'),
    },
    {
        path: '/page-ticket',
        name: 'tickets',
        alias: '/page-ticket',
        component: () => import('../view/TicketsPage.vue'),
    },
    {
        path: '/tickets/:id',
        name: 'ticket-detail',
        component: () => import('../view/TicketDetailPage.vue'),
    },
    
    {
        path: '/create-compte',
        alias: '/register',
        name : 'register',
        component: () => import('../view/RegisterForm.vue'),
    },
    {
        path: '/dashboard',
        alias: '/dashboard',
        name : 'dashboard',
        component: () => import('../view/Dashboard.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;