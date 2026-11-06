import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { auth, database } from '../services/firebase.js';
import { ref, get } from 'firebase/database';

declare module 'vue-router' {
    interface RouteMeta {
        requiresAuth?: boolean;
        layout?: 'app' | 'blank';
        roles?: number[];
    }
}
// Récupération du rôle
let cachedRole: number | null = null;
let cachedUid: string | null = null;

async function getUserRole(uid: string): Promise<number | null> {
    if (cachedUid === uid && cachedRole !== null) return cachedRole;

    const snap = await get(ref(database, `profiles/${uid}/role`));
    if (!snap.exists()) return null;

    const role = Number(snap.val());
    cachedUid = uid;
    cachedRole = Number.isNaN(role) ? null : role;
    return cachedRole;
}

export function clearRoleCache() {
    cachedRole = null;
    cachedUid = null;
}

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        alias: '/connexion',
        name: 'login',
        component: () => import('../view/Connexion.vue'),
        meta: { layout: 'blank' },
    },
    {
        path: '/create-ticket',
        name: 'ticket-create',
        component: () => import('../view/CreateTicket.vue'),
        meta: { requiresAuth: true, layout: 'app', roles: [1, 3, 4] },
    },
    {
        path: '/analytics',
        name: 'analytics',
        component: () => import('../view/Analytics.vue'),
        meta: { requiresAuth: true, layout: 'app', roles: [3, 4] },
    },
    {
        path: '/page-ticket',
        name: 'tickets',
        component: () => import('../view/TicketsPage.vue'),
        meta: { requiresAuth: true, layout: 'app', roles: [1, 2, 3, 4] },
    },
    {
        path: '/tickets/:id',
        name: 'ticket-detail',
        component: () => import('../view/TicketDetailPage.vue'),
        meta: { requiresAuth: true, layout: 'app', roles: [1, 2, 3, 4] },
    },
    {
        path: '/create-compte',
        alias: '/register',
        name: 'register',
        component: () => import('../view/RegisterForm.vue'),
        meta: { requiresAuth: true, layout: 'app', roles: [4] },
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../view/Dashboard.vue'),
        meta: { requiresAuth: true, layout: 'app' },
    },
];

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
    if (to.name === 'login' && currentUser) {
        return { name: 'dashboard' };
    }

    if (currentUser) {
        const allowedRoles = to.matched.find(r => r.meta.roles)?.meta.roles;

        if (allowedRoles) {
            const role = await getUserRole(currentUser.uid);
            if (role === null || !allowedRoles.includes(role)) {
                return { name: 'dashboard' };
            }
        }
    }
});

export default router;