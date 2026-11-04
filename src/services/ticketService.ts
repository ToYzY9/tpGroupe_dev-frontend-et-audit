import { get, push, ref, serverTimestamp, set } from "firebase/database";
import { database } from "./firebase";
import type { TicketFormData } from "../components/TicketForm.vue";
import type { TicketComment, TicketHistory  } from "../components/types/ticket";


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

export const saveComment = async (ticketId: number, content: string, author: string) => {
  const commentRef = push(ref(database, `comment/${ticketId}`));
  if (!commentRef.key) {
    throw new Error("Impossible de générer une référence pour le commentaire.");
  }
  await set(commentRef, { content, author, created_at: serverTimestamp() });
  return commentRef.key;
};

export const getTicketHistory = async (ticketId: number): Promise<TicketHistory[]> => {
  const snapshot = await get(ref(database, `history/${ticketId}`));
  if (!snapshot.exists()) return [];
  return Object.entries(snapshot.val() as Record<string, { field: string; old_value: string | null; new_value: string | null; changed_by: { id: number; name: string }; updated_at: number }>)
    .map(([key, h]) => ({
      id: key,
      ticketId,
      field: h.field,
      old_value: h.old_value,
      new_value: h.new_value,
      changed_by: {
        id: h.changed_by.id,
        name: h.changed_by.name,
      },
      updated_at: new Date(h.updated_at),
    }));
};

export const getComments = async (ticketId: number): Promise<TicketComment[]> => {
  const snapshot = await get(ref(database, `comment/${ticketId}`));
  if (!snapshot.exists()) return [];
  return Object.entries(snapshot.val() as Record<string, { content: string; author: string; created_at: number }>)
    .map(([key, c]) => ({
      id: key,
      content: c.content,
      author: c.author,
      createdAt: new Date(c.created_at),
    }));
};
export const saveTicketHistory = async (entry: Omit<TicketHistory, "id" | "updated_at">) => {
  const historyRef = push(ref(database, `history/${entry.ticketId}`));
  if (!historyRef.key) {
    throw new Error("Impossible de générer une référence pour l'historique.");
  }
  await set(historyRef, {
    field: entry.field,
    old_value: entry.old_value,
    new_value: entry.new_value,
    changed_by: entry.changed_by,
    updated_at: serverTimestamp(),
  });
  return historyRef.key;
};
