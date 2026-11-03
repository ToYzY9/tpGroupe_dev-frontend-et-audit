<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Ticket } from '../types/ticket'
import TicketPriorityBadge from './TicketPriorityBadge.vue'
import TicketStatusBadge from './TicketStatusBadge.vue'

defineProps<{ tickets: Ticket[] }>()

function formatComments(count: number): string {
  if (count === 0) return 'aucun commentaire'
  return count === 1 ? '1 commentaire' : `${count} commentaires`
}

function formatDate(date: Date): string {
  const day = date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  return `${day} · ${time}`
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table [&_td]:px-6 [&_td]:py-4 [&_th]:px-6 [&_tr]:border-base-300">
      <thead>
        <tr class="bg-base-300/40 text-base-content/80">
          <th scope="col">N°</th>
          <th scope="col">Sujet</th>
          <th scope="col">Priorité</th>
          <th scope="col">Statut</th>
          <th scope="col">Technicien</th>
          <th scope="col">Mis à jour</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ticket in tickets" :key="ticket.id">
          <td>#{{ ticket.id }}</td>
          <td>
            <RouterLink
              :to="{ name: 'ticket-detail', params: { id: ticket.id } }"
              class="link underline-offset-4 decoration-base-content/50 font-semibold hover:text-primary"
            >
              {{ ticket.title }}
            </RouterLink>
            <div class="text-sm opacity-70">
              {{ ticket.category }} · {{ formatComments(ticket.commentCount) }}
            </div>
          </td>
          <td><TicketPriorityBadge :priority="ticket.priority" /></td>
          <td><TicketStatusBadge :status="ticket.status" /></td>
          <td :class="{ 'opacity-60': !ticket.technician }">
            {{ ticket.technician?.name ?? 'Non affecté' }}
          </td>
          <td class="whitespace-nowrap">
            <time :datetime="ticket.updatedAt.toISOString()">{{ formatDate(ticket.updatedAt) }}</time>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
