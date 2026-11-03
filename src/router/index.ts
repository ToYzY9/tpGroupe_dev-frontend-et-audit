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
        name: 'ticket-create',
        alias: '/create-ticket',
        component: () => import('../view/CreateTicket.vue'),
    },
    {
        path: '/analytics',
        alias: '/analytics',
        component: () => import('../view/Analytics.vue'),
    },
    {
        path: '/page-ticket',
        alias: '/page-ticket',
        component: () => import('../view/TicketsPage.vue'),
    },
    {
        path: '/tickets/:id',
        name: 'ticket-detail',
        component: () => import('../view/TicketDetailPage.vue'),
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