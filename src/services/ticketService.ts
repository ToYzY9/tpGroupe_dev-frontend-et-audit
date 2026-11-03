import { push, ref, serverTimestamp, set } from "firebase/database";
import { database } from "./firebase";
import type { TicketFormData } from "../components/TicketForm.vue";

export const saveTicket = async (ticketData: TicketFormData, userId: string | null = null) => {
  const ticket = {
    title: ticketData.title,
    description: ticketData.description,
    created_at: serverTimestamp(),
    last_update: null,
    id_priority: ticketData.priority,
    id_category: ticketData.category,
    id_author: userId,
    id_status: "Nouveau",
    id_technician: null,
  };

  const ticketRef = push(ref(database, "ticket"));
  if (!ticketRef.key) {
    throw new Error("Impossible de générer une référence pour le ticket.");
  }
  await set(ticketRef, ticket);
  return ticketRef.key;
};
