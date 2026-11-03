<template>
  <div class="min-h-screen bg-[#13141c] p-6 flex justify-center items-start pt-12 md:pt-20">
    
    <TicketForm 
      @submit-ticket="createTicket" 
      @cancel="goBack" 
    />

  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import TicketForm, { type TicketFormData } from '../components/TicketForm.vue'

const router = useRouter()

const createTicket = async (data: TicketFormData) => {
  try {
    console.log("Données du formulaire prêtes pour Firebase :", data)

    router.push('/dashboard')
  } catch (error) {
    console.error("Erreur lors de la création du ticket", error)
  }
}

const goBack = () => {
  router.back()
}
</script>