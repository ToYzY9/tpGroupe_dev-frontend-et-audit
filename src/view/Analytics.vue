<script setup lang="ts">
 
  import ResolutionTimeCard from '../components/analytics/ResolutionTimeCard.vue';
  import OpenTicketsCard from '../components/analytics/OpenTicketsCard.vue';
  import SlaComplianceCard from '../components/analytics/SlaComplianceCard.vue';
  import TechnicianWorkloadCard from '../components/analytics/TechnicianWorkloadCard.vue';
  import CriticalIncidentsTable from '../components/analytics/CriticalIncidentsTable.vue';
</script>

<template>
   
    <div class="flex flex-col gap-6">

      <header>
        <h1 class="text-3xl font-bold text-primary">Pilotage Responsable</h1>
        <p class="opacity-70">Analyse de la performance opérationnelle en temps réel.</p>
      </header>

      <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ResolutionTimeCard />
        <OpenTicketsCard />
        <SlaComplianceCard />
      </section>

      <TechnicianWorkloadCard />

      <CriticalIncidentsTable />

    </div>
   
</template>
