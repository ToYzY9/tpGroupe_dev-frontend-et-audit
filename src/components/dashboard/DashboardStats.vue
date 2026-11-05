<script setup lang="ts">
import { Inbox, Siren, UserRoundX, CircleCheckBig } from 'lucide-vue-next'
import { onMounted, onUnmounted, ref } from 'vue'
import { getNbrTicket, getNbrTicketOuvert, getNbrTicketCritique, getNbrTicketResolue, getNbrTicketNonAffectes } from '../../services/dashboard.service'

// Branche une fonction du service sur un compteur : écoute au montage, arrêt au démontage
const useCompteur = (ecouter: (callback: (nbr: number) => void) => () => void) => {
  const compteur = ref(0)
  let stopEcoute: (() => void) | undefined

  onMounted(() => {
    stopEcoute = ecouter((nbr) => {
      compteur.value = nbr
    })
  })
  onUnmounted(() => stopEcoute?.())

  return compteur
}

const ticketsOuverts = useCompteur(getNbrTicketOuvert)
const ticketsCritiques = useCompteur(getNbrTicketCritique)
const ticketsNonAffectees = useCompteur(getNbrTicketNonAffectes)
const ticketsResolue = useCompteur(getNbrTicketResolue)
const ticketsEnregistres = useCompteur(getNbrTicket)
</script>

<template>
  <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" aria-label="Résumé de la journée">

    <article class="flex flex-col gap-2 bg-base-200 border border-base-300 rounded-box p-4">
      <header class="flex items-center justify-between">
        <h2 class="text-xs font-medium opacity-70">Mes tickets ouverts</h2>
        <Inbox class="w-4 h-4 text-info" />
      </header>
      <p class="text-3xl font-bold text-info">{{ ticketsOuverts }}</p>
      <p class="text-xs opacity-70">dont 3 mis à jour aujourd'hui</p>
    </article>

    <article class="flex flex-col gap-2 bg-base-200 border border-base-300 rounded-box p-4">
      <header class="flex items-center justify-between">
        <h2 class="text-xs font-medium opacity-70">Critiques à traiter</h2>
        <Siren class="w-4 h-4 text-error" />
      </header>
      <p class="text-3xl font-bold text-error">{{ ticketsCritiques }}</p>
      <p class="text-xs opacity-70">le plus ancien date d'hier</p>
    </article>

    <article class="flex flex-col gap-2 bg-base-200 border border-base-300 rounded-box p-4">
      <header class="flex items-center justify-between">
        <h2 class="text-xs font-medium opacity-70">Tickets non affectés</h2>
        <UserRoundX class="w-4 h-4 text-warning" />
      </header>
      <p class="text-3xl font-bold text-warning">{{ ticketsNonAffectees }}</p>
      <p class="text-xs opacity-70">en attente d'un technicien</p>
    </article>

    <article class="flex flex-col gap-2 bg-base-200 border border-base-300 rounded-box p-4">
      <header class="flex items-center justify-between">
        <h2 class="text-xs font-medium opacity-70">Tickets résolus</h2>
        <CircleCheckBig class="w-4 h-4 text-success" />
      </header>
      <p class="text-3xl font-bold text-success">{{ ticketsResolue }}</p>
      <p class="text-xs opacity-70">sur {{ ticketsEnregistres }} {{ ticketsEnregistres > 1 ? 'tickets enregistrés' : 'ticket enregistré' }}</p>
    </article>

  </section>
</template>
