<template>
  <div class="min-h-screen bg-base-100 p-6 flex flex-col items-center pt-12 md:pt-20">
    <TicketForm 
      :save-ticket="saveTicket"
      :can-create-ticket="canCreateTicket"
      @cancel="goBack" 
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import TicketForm from '../components/TicketForm.vue'
import { canCreateTicket, saveTicket } from '../services/ticketListeService'

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>