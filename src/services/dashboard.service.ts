import { database } from "./firebase";
import { equalTo, onValue, orderByChild, query, ref, type Unsubscribe } from "firebase/database";

// Écoute le nœud "tickets" : callback est appelé au démarrage puis à chaque changement.
// Retourne la fonction qui arrête l'écoute, à appeler quand le composant est démonté.
export const getNbrTicket = (callback: (nbrTicket: number) => void): Unsubscribe => {
    return onValue(
        ref(database, "tickets"),
        (snapshot) => callback(snapshot.size),
        (error) => console.error("Impossible de lire le nombre de tickets :", error),
    );
};

// Même principe que getNbrTicket, limité aux tickets dont le statut est "En cours".
export const getNbrTicketOuvert = (callback: (nbrTicketOuvert: number) => void): Unsubscribe => {
    return onValue(
        query(ref(database, "tickets"), orderByChild("id_status"), equalTo(2)),
        (snapshot) => callback(snapshot.size),
        (error) => console.error("Impossible de lire le nombre de tickets ouverts :", error),
    );
};
// Même principe que getNbrTicket, limité aux tickets dont le priorité  est "critique".
export const getNbrTicketCritique = (callback: (nbrTicketCritique: number) => void): Unsubscribe => {
    return onValue(
        query(ref(database, "tickets"), orderByChild("id_priority"), equalTo(1)),
        (snapshot) => callback(snapshot.size),
        (error) => console.error("Impossible de lire le nombre de tickets en critique :", error),
    );
};

// Même principe que getNbrTicket, limité aux tickets dont aucun technicien nest affecter  

export const getNbrTicketNonAffectes = (callback: (NbrTicketNonAffectes: number) => void): Unsubscribe => {
    return onValue(
        query(ref(database, "tickets"), orderByChild("id_technician"), equalTo(null)),
        (snapshot) => callback(snapshot.size),
        (error) => console.error("Impossible de lire le nombre de tickets non affectées :", error),
    );
};

// Même principe que getNbrTicket, limité aux tickets dont le statut est "En cours".
export const getNbrTicketResolue = (callback: (nbrTicketResolue: number) => void): Unsubscribe => {
    return onValue(
        query(ref(database, "tickets"), orderByChild("id_status"), equalTo(3)),
        (snapshot) => callback(snapshot.size),
        (error) => console.error("Impossible de lire le nombre de tickets resolue :", error),
    );
};

// Un ticket tel qu'il est stocké dans le nœud "tickets"
export interface TicketFirebase {
    id_ticket: number;
    title: string;
    description: string;
    created_at: string;
    last_update: string;
    id_priority: number;
    id_category: number;
    id_author?: number; // absent si le ticket a été créé sans auteur
    id_status: number;
    id_technician?: number; // absent tant qu'aucun technicien n'est affecté
}

// Écoute "tickets" et renvoie tous les tickets, du plus urgent au moins urgent.
// id_priority va de 1 (Critique) à 4 (Mineure) : le tri se fait donc par valeur croissante.
export const getTicketsPrioritaire = (callback: (tickets: TicketFirebase[]) => void): Unsubscribe => {
    return onValue(
        ref(database, "tickets"),
        (snapshot) => {
            const tickets: TicketFirebase[] = [];
            snapshot.forEach((ticket) => {
                tickets.push(ticket.val());
            });

            callback(tickets.sort((a, b) => a.id_priority - b.id_priority));
        },
        (error) => console.error("Impossible de lire les tickets prioritaires :", error),
    );
};