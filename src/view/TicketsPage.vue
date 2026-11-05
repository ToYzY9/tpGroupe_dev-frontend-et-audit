<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import type { TicketFilter, TicketSort } from '../components/types/ticket.ts'
import { getTicketsPrioritaire, type TicketFirebase } from '../services/dashboard.service'
import { getTicketLabels, toTicket, type TicketLabels } from '../services/ticketListeService.js'
import { countTickets, filterTickets, paginate, searchTickets, sortTickets } from '../components/utils/ticketList.js'
import TicketFilters from '../components/tickets/TicketFilters.vue'
import TicketSearch from '../components/tickets/TicketSearch.vue'
import TicketTable from '../components/tickets/TicketTable.vue'
import TicketPagination from '../components/tickets/TicketPagination.vue'
import { getTickets } from '../services/ticketService.js'

const FILTER_TITLES: Record<TicketFilter, string> = {
  all: 'Tous les tickets',
  open: 'Tickets non clôturés',
  closed: 'Tickets clôturés',
}

const ticketsFirebase = ref<TicketFirebase[]>([])
const labels = ref<TicketLabels>()
const filter = ref<TicketFilter>('all')
const search = ref('')
const sort = ref<TicketSort>('priority')
const page = ref(1)

const tickets = computed(() => {
  const ticketLabels = labels.value
  return ticketLabels ? ticketsFirebase.value.map((ticket) => toTicket(ticket, ticketLabels)) : []
})

const counts = computed(() => countTickets(tickets.value))

// Chaîne de traitement : filtre → recherche → tri → page
const results = computed(() =>
  sortTickets(searchTickets(filterTickets(tickets.value, filter.value), search.value), sort.value),
)
const pageTickets = computed(() => paginate(results.value, page.value))

// Un nouveau critère peut réduire le nombre de pages : on revient à la première
watch([filter, search, sort], () => {
  page.value = 1
})

function clearFilters() {
  filter.value = 'all'
  search.value = ''
}

let stopEcoute: (() => void) | undefined

onMounted(async () => {
  stopEcoute = getTicketsPrioritaire((liste) => {
    ticketsFirebase.value = liste
  })
  labels.value = await getTicketLabels()
})

onUnmounted(() => stopEcoute?.())
</script>

<template>
  <section class="flex flex-col gap-6">
    <header class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-primary">Mes tickets</h1>
        <p class="opacity-70">{{ counts.all }} tickets déclarés depuis votre arrivée.</p>
      </div>
      <RouterLink :to="{ name: 'ticket-create' }" class="btn btn-primary">
        + Déclarer un incident
      </RouterLink>
    </header>

    <div class="flex justify-between items-end flex-wrap gap-4">
      <TicketFilters v-model="filter" :counts="counts" />
      <TicketSearch v-model="search" v-model:sort="sort" />
    </div>

    <div v-if="results.length > 0" class="bg-base-200 border border-base-300 rounded-box overflow-hidden">
      <h2 class="px-6 py-5 text-xl font-bold text-primary">
        {{ FILTER_TITLES[filter] }} · {{ results.length }} résultat{{ results.length > 1 ? 's' : '' }}
      </h2>
      <TicketTable :tickets="pageTickets" />
      <div class="px-6 py-4 border-t border-base-300">
        <TicketPagination v-model="page" :total="results.length" />
      </div>
    </div>

    <div
      v-else
      class="flex flex-col items-center gap-3 p-10 text-center bg-base-200 border border-dashed border-base-content/30 rounded-box"
    >
      <svg class="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <p class="text-lg font-semibold">Aucun ticket ne correspond à votre recherche</p>
      <p class="opacity-70">Vérifiez l'orthographe ou affichez tous les statuts.</p>
      <button type="button" class="btn btn-outline border-base-content/40" @click="clearFilters">Effacer les filtres</button>
    </div>
  </section>
</template>
