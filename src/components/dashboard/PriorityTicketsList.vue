<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { getTicketsCritiquesNonAffectes, type TicketFirebase } from '../../services/dashboard.service'
import { getTicketLabels, toTicket, type TicketLabels } from '../../services/ticketListeService'
import TicketPriorityBadge from '../tickets/TicketPriorityBadge.vue'
import TicketStatusBadge from '../tickets/TicketStatusBadge.vue'

const ticketsFirebase = ref<TicketFirebase[]>([])
const labels = ref<TicketLabels>()

// getTicketsCritiquesNonAffectes renvoie déjà les tickets du plus ancien au plus récent
const tickets = computed(() => {
  const ticketLabels = labels.value
  if (!ticketLabels) return []
  return ticketsFirebase.value.map((ticket) => toTicket(ticket, ticketLabels))
})

let stopEcoute: (() => void) | undefined

onMounted(async () => {
  stopEcoute = getTicketsCritiquesNonAffectes((liste) => {
    ticketsFirebase.value = liste
  })
  labels.value = await getTicketLabels()
})

onUnmounted(() => stopEcoute?.())

function formatComments(count: number): string {
  if (count === 0) return 'aucun commentaire'
  return count === 1 ? '1 commentaire' : `${count} commentaires`
}

// "Il y a 35 min", "Il y a 4 h", "Hier", "Il y a 3 j"
function formatUpdatedAt(date: Date): string {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60_000)
  if (minutes < 60) return `Il y a ${Math.max(minutes, 1)} min`

  const heures = Math.floor(minutes / 60)
  if (heures < 24) return `Il y a ${heures} h`

  const jours = Math.floor(heures / 24)
  return jours === 1 ? 'Hier' : `Il y a ${jours} j`
}
</script>

<template>
  <article class="bg-base-200 border border-base-300 rounded-box overflow-hidden">
    <header class="flex items-center justify-between px-6 py-5">
      <h2 class="text-xl font-bold text-primary">Mes tickets prioritaires</h2>
      <RouterLink to="/page-ticket" class="text-sm text-info hover:underline">Voir tous mes tickets</RouterLink>
    </header>

    <!-- La liste défile à l'intérieur de la carte, l'en-tête reste visible -->
    <div class="max-h-96 overflow-auto">
      <table class="table table-pin-rows [&_td]:px-6 [&_td]:py-4 [&_th]:px-6 [&_tr]:border-base-300">
        <thead>
          <tr class="bg-base-300 text-base-content/80">
            <th scope="col">N°</th>
            <th scope="col">Sujet</th>
            <th scope="col">Priorité</th>
            <th scope="col">Statut</th>
            <th scope="col">Mis à jour</th>
          </tr>
        </thead>
        <tbody>

          <tr v-for="ticket in tickets" :key="ticket.id">
            <td>#{{ ticket.id }}</td>
            <td>
              <RouterLink :to="{ name: 'ticket-detail', params: { id: ticket.id } }" class="font-semibold hover:text-info">{{ ticket.title }}</RouterLink>
              <p class="text-sm opacity-70">{{ ticket.category }} · {{ formatComments(ticket.comments.length) }}</p>
            </td>
            <td><TicketPriorityBadge :priority="ticket.priority" /></td>
            <td class="whitespace-nowrap"><TicketStatusBadge :status="ticket.status" /></td>
            <td class="whitespace-nowrap">{{ formatUpdatedAt(ticket.updatedAt) }}</td>
          </tr>

          <tr v-if="labels && tickets.length === 0">
            <td colspan="5" class="text-center opacity-70">0 ticket à prendre en charge</td>
          </tr>

        </tbody>
      </table>
    </div>
  </article>
</template>
