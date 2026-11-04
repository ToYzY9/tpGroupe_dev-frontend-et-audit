import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import {auth} from '../services/firebase.js';

const routes: RouteRecordRaw[] =[
    {
        path: '/',
        alias: '/connexion',
        name : 'login',
        component: () => import('../view/Connexion.vue'),
    },
    {
        path: '/create-ticket',
        name: 'ticket-create',
        component: () => import('../view/CreateTicket.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/analytics',
        name: 'analytics',
        component: () => import('../view/Analytics.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/page-ticket',
        name: 'tickets',
        component: () => import('../view/TicketsPage.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/tickets/:id',
        name: 'ticket-detail',
        component: () => import('../view/TicketDetailPage.vue'),
        meta: { requiresAuth: true },
    },
    
    {
        path: '/create-compte',
        alias: '/register',
        name : 'register',
        component: () => import('../view/RegisterForm.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/dashboard',
        name : 'dashboard',
        component: () => import('../view/Dashboard.vue'),
        meta: { requiresAuth: true },
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
    if ((to.name === 'login') && currentUser) {
        return { name: 'dashboard' };
    }
});

export default router;