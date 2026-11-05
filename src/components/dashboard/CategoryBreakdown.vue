<template>
  <article class="bg-base-200 border border-base-300 rounded-box p-6">
    <h2 class="text-xl font-bold text-primary mb-4">Mes tickets par catégorie</h2>

    <ul class="flex flex-col gap-4">

      <li v-for="category in categories" :key="category.id_category">
        <div class="flex justify-between text-sm mb-1.5">
          <span class="font-semibold">{{ category.category_name }}</span>
          <span class="opacity-70">{{ category.nbrTickets }} {{ category.nbrTickets > 1 ? 'tickets' : 'ticket' }}</span>
        </div>
        <div class="h-2 w-full bg-base-100 rounded-full overflow-hidden">
          <div class="h-full bg-info rounded-full" :style="{ width: largeurBarre(category.nbrTickets) }"></div>
        </div>
      </li>

    </ul>
  </article>
</template>
<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { categoryBreakdown, type CategoryCount } from '../../services/dashboard.service'

const categories = ref<CategoryCount[]>([])
const totalTickets = computed(() => categories.value.reduce((total, category) => total + category.nbrTickets, 0))

// Part de la catégorie dans le total, pour la largeur de la barre
const largeurBarre = (nbrTickets: number): string =>
  totalTickets.value > 0 ? `${(nbrTickets / totalTickets.value) * 100}%` : '0%'

let stopEcoute: (() => void) | undefined

onMounted(() => {
  stopEcoute = categoryBreakdown((liste) => {
    categories.value = liste
  })
})

onUnmounted(() => stopEcoute?.())
</script>
