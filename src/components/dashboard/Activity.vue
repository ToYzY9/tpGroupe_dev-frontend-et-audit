<template>
  <!-- Conteneur principal (prend toute la largeur disponible de son parent) -->
  <div class="flex flex-col w-full h-full bg-base-200 border border-base-300 p-6 rounded-box text-base-content">

    <!-- Titre -->
    <h3 class="shrink-0 text-primary text-lg font-bold mb-6">Flux d'activité</h3>

    <p v-if="evenements.length === 0" class="text-xs text-base-content/80">Aucune activité pour le moment.</p>

    <!-- Liste de la Timeline : défile à l'intérieur de la carte -->
    <div class="relative flex flex-col flex-1 min-h-0 overflow-y-auto p-1 pr-3">

      <div v-for="(evenement, index) in evenements" :key="evenement.id" class="relative flex gap-4 pb-6">
        <!-- Ligne verticale connectrice (sauf pour le dernier élément) -->
        <div v-if="index < evenements.length - 1" class="absolute left-2 top-4 bottom-0 w-px bg-base-300"></div>
        <!-- Point indicateur -->
        <div class="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ring-4 ring-base-200" :class="AFFICHAGE_TYPES[evenement.type].couleur"></div>
        <!-- Contenu -->
        <div class="w-full">
          <div class="flex justify-between items-baseline mb-1">
            <time class="text-info text-xs font-medium" :datetime="evenement.date.toISOString()">{{ tempsEcoule(evenement.date) }}</time>
            <span class="text-base-content/70 text-mini font-bold uppercase tracking-wider">{{ AFFICHAGE_TYPES[evenement.type].libelle }}</span>
          </div>
          <p class="text-xs text-base-content/80 leading-relaxed">
            <template v-if="evenement.auteur">
              <strong class="font-bold text-base-content">{{ evenement.auteur }}</strong> ·
            </template>
            {{ evenement.message }}
          </p>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts" >
import { onMounted, onUnmounted, ref } from 'vue'
import { activityFlux, type ActivityEvent, type ActivityType } from '../../services/dashboard.service'

const AFFICHAGE_TYPES: Record<ActivityType, { libelle: string; couleur: string }> = {
  CREATION: { libelle: 'Création', couleur: 'bg-primary' },
  COMPTE: { libelle: 'Compte', couleur: 'bg-primary' },
  STATUT: { libelle: 'Statut', couleur: 'bg-info' },
  PRIORITE: { libelle: 'Priorité', couleur: 'bg-info' },
  AFFECTATION: { libelle: 'Affectation', couleur: 'bg-info' },
  MODIFICATION: { libelle: 'Modification', couleur: 'bg-info' },
  RESOLUTION: { libelle: 'Résolution', couleur: 'bg-success' },
  CLOTURE: { libelle: 'Clôture', couleur: 'bg-success' },
}

const evenements = ref<ActivityEvent[]>([])
const maintenant = ref(Date.now())

// "À l'instant", "Il y a 35 min", "Il y a 4 h", "Hier", "Il y a 3 j"
function tempsEcoule(date: Date): string {
  const minutes = Math.floor((maintenant.value - date.getTime()) / 60_000)
  if (minutes < 1) return "À l'instant"
  if (minutes < 60) return `Il y a ${minutes} min`

  const heures = Math.floor(minutes / 60)
  if (heures < 24) return `Il y a ${heures} h`

  const jours = Math.floor(heures / 24)
  return jours === 1 ? 'Hier' : `Il y a ${jours} j`
}

let stopEcoute: (() => void) | undefined
let horloge: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  stopEcoute = activityFlux((liste) => {
    evenements.value = liste
    maintenant.value = Date.now()
  })
  // Fait avancer les "Il y a..." même quand rien ne change dans la base
  horloge = setInterval(() => {
    maintenant.value = Date.now()
  }, 60_000)
})

onUnmounted(() => {
  stopEcoute?.()
  clearInterval(horloge)
})
</script>
