import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import {auth} from '../services/firebase.js';

declare module 'vue-router' {
    interface RouteMeta {
        requiresAuth?: boolean;
        layout?: 'app' | 'blank';
    }
}

const routes: RouteRecordRaw[] =[
    {
        path: '/',
        alias: '/connexion',
        name : 'login',
        component: () => import('../view/Connexion.vue'),
        meta : {layout : 'blank'},
    },
    {
        path: '/create-ticket',
        name: 'ticket-create',
        component: () => import('../view/CreateTicket.vue'),
        meta: { requiresAuth: true, layout :'app' },
    },
    {
        path: '/analytics',
        name: 'analytics',
        component: () => import('../view/Analytics.vue'),
        meta: { requiresAuth: true, layout :'app' },
    },
    {
        path: '/page-ticket',
        name: 'tickets',
        component: () => import('../view/TicketsPage.vue'),
        meta: { requiresAuth: true, layout :'app' },
    },
    {
        path: '/tickets/:id',
        name: 'ticket-detail',
        component: () => import('../view/TicketDetailPage.vue'),
        meta: { requiresAuth: true, layout :'app' },
    },
    
    {
        path: '/create-compte',
        alias: '/register',
        name : 'register',
        component: () => import('../view/RegisterForm.vue'),
        meta: { requiresAuth: true, layout :'app' },
    },
    {
        path: '/dashboard',
        name : 'dashboard',
        component: () => import('../view/Dashboard.vue'),
        meta: { requiresAuth: true, layout :'app' },
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