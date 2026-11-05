<template>
  <div class="bg-base-200 border border-base-300 rounded-box shadow-2xl w-full max-w-3xl overflow-hidden">
    
    <div class="p-6 border-b border-base-300">
      <h2 class="text-2xl font-bold text-primary mb-2">Déclarer un incident</h2>
      <p class="text-sm text-base-content/70">
        Décrivez le problème : un technicien prendra le ticket en charge. Les champs marqués * sont obligatoires.
      </p>
    </div>

    <div class="p-6">
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
        
        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold">Titre de l'incident *</label>
          <input 
            v-model="form.title" 
            type="text" 
            placeholder="Ex. : impossible de me connecter au VPN" 
            class="input w-full" 
            maxlength="100"
            required
          />
          <span class="text-xs text-base-content/70">Entre 1 et 100 caractères.</span>
        </div>

        <div class="flex flex-col md:flex-row gap-6">
          
          <div class="flex flex-col gap-2 w-full md:w-1/2">
            <label class="text-sm font-semibold">Catégorie *</label>
            <select 
              v-model="form.category" 
              class="select w-full"
              required
            >
              <option disabled value="">Choisir une catégorie</option>
              <option value="materiel">Matériel</option>
              <option value="logiciel">Logiciel</option>
              <option value="reseau">Réseau</option>
              <option value="acces">Accès / Compte</option>
            </select>
          </div>

          <div class="flex flex-col gap-2 w-full md:w-1/2">
            <label class="text-sm font-semibold">Priorité *</label>
            <div class="flex flex-wrap gap-3 items-center">
              <label 
                v-for="p in priorities" 
                :key="p"
                class="flex items-center gap-2 px-4 py-1.5 rounded-full border cursor-pointer transition-all duration-200"
                :class="[
                  form.priority === p 
                    ? 'border-primary bg-primary/20 text-base-content' 
                    : 'border-base-300 text-base-content/80 hover:border-base-content/40 hover:bg-base-300'
                ]"
              >
                <input 
                  type="radio" 
                  v-model="form.priority" 
                  :value="p" 
                  class="hidden" 
                  required
                />
                <span 
                  class="w-2.5 h-2.5 rounded-full"
                  :class="form.priority === p ? 'bg-primary' : 'bg-base-content/40'"
                ></span>
                <span class="text-sm font-medium">{{ p }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-sm font-semibold">Description détaillée *</label>
          <textarea 
            v-model="form.description" 
            placeholder="Ce qui se passe, depuis quand, le message d'erreur affiché, le numéro du poste concerné..." 
            class="textarea w-full h-32 resize-none" 
            maxlength="2000"
            required
          ></textarea>
          <div class="flex justify-between items-center text-xs text-base-content/70 mt-1">
            <span>Au moins 1 caractère.</span>
            <span>{{ form.description.length }} / 2000</span>
          </div>
        </div>

        <div class="flex flex-col gap-3 mt-4 pt-6 border-t border-base-300">
          <p role="status" aria-live="polite" class="text-sm text-base-content/80">{{ message }}</p>
          <div class="flex justify-end gap-3">
            <button 
              type="button" 
              class="px-6 py-2 rounded-md border border-base-300 text-base-content font-medium hover:bg-base-300 transition-colors" 
              :disabled="isSubmitting"
              @click="emit('cancel')"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              class="px-6 py-2 rounded-md bg-primary hover:bg-primary/90 text-primary-content font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              :disabled="!isValid || isSubmitting"
            >
              Envoyer le ticket
            </button>
          </div>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'

export type TicketPriority = 'Basse' | 'Moyenne' | 'Haute' | 'Critique'

export interface TicketFormData {
  title: string
  category: string
  priority: TicketPriority
  description: string
}

const props = defineProps<{
  saveTicket: (data: TicketFormData) => Promise<number>
  canCreateTicket: () => Promise<boolean>
}>()

const emit = defineEmits<{
  (e: 'cancel'): void
}>()

const form = reactive<TicketFormData>({
  title: '',
  category: '',
  priority: 'Moyenne',
  description: ''
})

const priorities: TicketPriority[] = ['Basse', 'Moyenne', 'Haute', 'Critique']
const message = ref('Formulaire pas encore soumis')
const isSubmitting = ref(false)

const isValid = computed(() =>
  form.title.trim().length >= 1 &&
  form.category !== '' &&
  form.description.trim().length >= 1
)

const handleSubmit = async () => {
  if (!isValid.value || isSubmitting.value) return

  const data = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim()
  }
  message.value = 'En cours de traitement'
  isSubmitting.value = true
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  try {
    if (!(await props.canCreateTicket())) {
      message.value = "Vous devez être connecté avec un rôle Collaborateur, Responsable ou Administrateur pour créer un ticket."
      return
    }
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error('TICKET_SAVE_TIMEOUT')), 15000)
    })
    const ticketId = await Promise.race([props.saveTicket(data), timeout])
    message.value = `Ticket enregistré avec succès (n° ${ticketId}).`
  } catch (error) {
    console.error('Erreur lors de la création du ticket', error)
    message.value = error instanceof Error && error.message === 'TICKET_SAVE_TIMEOUT'
      ? 'Aucune confirmation reçue après 15 secondes. Vérifiez la Realtime Database avant de réessayer.'
      : `Erreur : le ticket n'a pas pu être enregistré${error instanceof Error ? ` (${error.message})` : ''}.`
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
    isSubmitting.value = false
  }
}
</script>