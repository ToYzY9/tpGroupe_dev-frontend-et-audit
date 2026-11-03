import { createRouter, createWebHistory } from 'vue-router'
import TicketsPage from '../../view/TicketsPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/tickets' },
    { path: '/tickets', name: 'tickets', component: TicketsPage },
    { path: '/tickets/new', name: 'ticket-create', component: () => import('../../view/CreateTicket.vue') },
    { path: '/tickets/:id', name: 'ticket-detail', component: () => import('../../view/TicketDetailPage.vue') },
  ],
})
