<template>
  <div class="min-h-screen bg-[#13141c] p-6 flex flex-col items-center pt-12 md:pt-20">
    <TicketForm 
      @submit-ticket="createTicket" 
      @cancel="goBack" 
    />
    <p role="status" aria-live="polite" class="mt-4 text-sm text-gray-300">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TicketForm, { type TicketFormData } from '../components/TicketForm.vue'
import { saveTicket } from "../services/ticketService"

const router = useRouter()
const message = ref('Formulaire pas encore soumis')

const createTicket = async (data: TicketFormData) => {
  message.value = 'En cours de traitement'
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  try {
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error('TICKET_SAVE_TIMEOUT')), 15000)
    })
    const ticketId = await Promise.race([saveTicket(data), timeout])
    message.value = `Ticket enregistré avec succès (n° ${ticketId}).`;
  } catch (error) {
    console.error("Erreur lors de la création du ticket", error);
    message.value = error instanceof Error && error.message === 'TICKET_SAVE_TIMEOUT'
      ? "Aucune confirmation reçue après 15 secondes. Vérifiez la Realtime Database avant de réessayer."
      : `Erreur : le ticket n'a pas pu être enregistré${error instanceof Error ? ` (${error.message})` : ''}.`
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
};

const goBack = () => {
  router.back()
}
</script>