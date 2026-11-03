<script setup lang="ts">
  import DefaultLayout from '../layout/DefaultLayout.vue';
  import ResolutionTimeCard from '../components/analytics/ResolutionTimeCard.vue';
  import OpenTicketsCard from '../components/analytics/OpenTicketsCard.vue';
  import SlaComplianceCard from '../components/analytics/SlaComplianceCard.vue';
  import TechnicianWorkloadCard from '../components/analytics/TechnicianWorkloadCard.vue';
  import CriticalIncidentsTable from '../components/analytics/CriticalIncidentsTable.vue';
</script>

<template>
  <DefaultLayout>
    <div class="flex flex-col gap-6">

      <header>
        <h1 class="text-2xl font-bold text-blue-700">Pilotage Responsable</h1>
        <p class="text-sm text-gray-500 mt-1">Analyse de la performance opérationnelle en temps réel.</p>
      </header>

      <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ResolutionTimeCard />
        <OpenTicketsCard />
        <SlaComplianceCard />
      </section>

      <TechnicianWorkloadCard />

      <CriticalIncidentsTable />

    </div>
  </DefaultLayout>
</template>
