import { createRouter, createWebHistory } from 'vue-router'
import TicketsPage from '../../views/TicketsPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/tickets' },
    { path: '/tickets', name: 'tickets', component: TicketsPage },
    { path: '/tickets/new', name: 'ticket-create', component: () => import('../../views/CreateIncidentPage.vue') },
    { path: '/tickets/:id', name: 'ticket-detail', component: () => import('../../views/TicketDetailPage.vue') },
  ],
})
