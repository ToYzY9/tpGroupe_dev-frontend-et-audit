<template>
  <section class="flex flex-col gap-6">

    <header>
      <h1 class="text-3xl font-bold text-primary">Tableau de bord</h1>
      <p class="opacity-70">Votre journée en un coup d'œil : ce qui demande votre attention maintenant.</p>
    </header>

    <DashboardStats />

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">

      <div class="xl:col-span-2 flex flex-col gap-6">
        <PriorityTicketsList />

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentComments />
          <CategoryBreakdown />
        </div>
      </div>

      <!-- En colonne, le flux prend la hauteur de la colonne de gauche et défile à l'intérieur -->
      <div class="relative h-96 xl:h-auto">
        <!-- <UnassignedTickets /> -->
        <div class="absolute inset-0">
          <Activity />
        </div>
      </div>

    </div>

  </section>
</template>

<script setup lang="ts">
import Activity from '../components/dashboard/Activity.vue'
import DashboardStats from '../components/dashboard/DashboardStats.vue'
import PriorityTicketsList from '../components/dashboard/PriorityTicketsList.vue'
import UnassignedTickets from '../components/dashboard/UnassignedTickets.vue'
import RecentComments from '../components/dashboard/RecentComments.vue'
import CategoryBreakdown from '../components/dashboard/CategoryBreakdown.vue'
</script>
