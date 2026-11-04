<template>
  <!-- Conteneur principal (prend toute la largeur disponible de son parent) -->
  <div class="w-full bg-base-200 p-6 rounded-box text-base-content">
    
    <!-- Titre -->
    <h3 class="text-primary text-lg font-bold mb-6">Flux d'activité</h3>

    <!-- Liste de la Timeline -->
    <div class="relative flex flex-col">
      
      <!-- Élément 1 : Update -->
      <div class="relative flex gap-4 pb-6">
        <!-- Ligne verticale connectrice (sauf pour le dernier élément si nécessaire) -->
        <div class="absolute left-2 top-4 bottom-0 w-px bg-base-300"></div>
        <!-- Point indicateur -->
        <div class="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-600 ring-4 ring-base-200"></div>
        <!-- Contenu -->
        <div class="w-full">
          <div class="flex justify-between items-baseline mb-1">
            <span class="text-blue-500 text-xs font-medium">Il y a 2m</span>
            <span class="text-base-content/70 text-[10px] font-bold uppercase tracking-wider">Update</span>
          </div>
          <p class="text-xs text-base-content/80 leading-relaxed">
            <strong class="font-bold text-base-content">Julien Clerc</strong> a escaladé l'incident #INC-2024-089 au Niveau 3.
          </p>
        </div>
      </div>

      <!-- Élément 2 : Resolution -->
      <div class="relative flex gap-4 pb-6">
        <div class="absolute left-2 top-4 bottom-0 w-px bg-base-300"></div>
        <div class="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-info ring-4 ring-base-200"></div>
        <div class="w-full">
          <div class="flex justify-between items-baseline mb-1">
            <span class="text-blue-500 text-xs font-medium">Il y a 15m</span>
            <span class="text-base-content/70 text-[10px] font-bold uppercase tracking-wider">Resolution</span>
          </div>
          <p class="text-xs text-base-content/80 leading-relaxed">
            L'incident #INC-2024-085 (Mail Server) a été marqué comme résolu.
          </p>
        </div>
      </div>

      <!-- Élément 3 : Alert -->
      <div class="relative flex gap-4 pb-6">
        <div class="absolute left-2 top-4 bottom-0 w-px bg-base-300"></div>
        <div class="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-600 ring-4 ring-base-200"></div>
        <div class="w-full">
          <div class="flex justify-between items-baseline mb-1">
            <span class="text-blue-500 text-xs font-medium">Il y a 22m</span>
            <span class="text-base-content/70 text-[10px] font-bold uppercase tracking-wider">Alert</span>
          </div>
          <p class="text-xs text-base-content/80 leading-relaxed">
            Nouvel incident critique détecté : <strong class="font-bold text-base-content">Brèche de sécurité</strong> Firewall 04.
          </p>
        </div>
      </div>

      <!-- Élément 4 : Assignment -->
      <div class="relative flex gap-4 pb-6">
        <!-- Pas de ligne absolute ici car c'est le dernier élément -->
        <div class="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-600 ring-4 ring-base-200"></div>
        <div class="w-full">
          <div class="flex justify-between items-baseline mb-1">
            <span class="text-blue-500 text-xs font-medium">Il y a 45m</span>
            <span class="text-base-content/70 text-[10px] font-bold uppercase tracking-wider">Assignment</span>
          </div>
          <p class="text-xs text-base-content/80 leading-relaxed">
            <strong class="font-bold text-base-content">Sophie L.</strong> a été assignée à 3 nouveaux tickets de niveau High.
          </p>
        </div>
      </div>

    </div>

    <!-- Bouton Voir tout l'historique -->
    <button class="w-full mt-4 py-2 border border-base-300 text-blue-500 text-xs font-semibold rounded hover:bg-base-300 transition-colors">
      Voir tout l'historique
    </button>

  </div>
</template>

<script setup lang="ts" >
</script>