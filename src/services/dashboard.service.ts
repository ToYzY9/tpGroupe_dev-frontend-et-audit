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
// Même principe que getNbrTicket, limité aux tickets critiques ni résolus (3) ni clôturés (4).
// Firebase ne filtre que sur un champ à la fois : le statut est donc vérifié ici.
export const getNbrTicketCritique = (callback: (nbrTicketCritique: number) => void): Unsubscribe => {
    return onValue(
        query(ref(database, "tickets"), orderByChild("id_priority"), equalTo(1)),
        (snapshot) => {
            let nbrTicketCritique = 0;
            snapshot.forEach((ticket) => {
                const { id_status } = ticket.val();
                if (id_status !== 3 && id_status !== 4) nbrTicketCritique += 1;
            });
            callback(nbrTicketCritique);
        },
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

// Même principe que getNbrTicket, limité aux tickets dont le statut est "Résolu".
export const getNbrTicketResolue =(callback: (nbrTicketResolue: number) => void): Unsubscribe => {
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

// Écoute "tickets" et renvoie les tickets critiques à prendre en charge, du plus ancien au plus récent :
// statut "Nouveau" (ni en cours, ni résolu, ni clôturé) et aucun technicien affecté.
export const getTicketsCritiquesNonAffectes = (callback: (tickets: TicketFirebase[]) => void): Unsubscribe => {
    return onValue(
        query(ref(database, "tickets"), orderByChild("id_priority"), equalTo(1)),
        (snapshot) => {
            const tickets: TicketFirebase[] = [];
            snapshot.forEach((ticket) => {
                tickets.push(ticket.val());
            });

            callback(
                tickets
                    .filter((ticket) => ticket.id_status === 1 && ticket.id_technician == null)
                    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
            );
        },
        (error) => console.error("Impossible de lire les tickets critiques non affectés :", error),
    );
};

// implementation fonction progresse barre pour count des tickets par catégorie 

export interface CategoryCount {
    id_category: number;
    category_name: string;
    nbrTickets: number;
}

interface CategoryFirebase {
    id_category: number;
    category_name: string;
    is_active: boolean;
}

// Écoute "categories" et "tickets" : callback est rappelé dès que l'un des deux change.
// Les catégories sont triées de la plus remplie à la moins remplie.
// Une catégorie désactivée n'apparaît que si des tickets y sont encore rattachés.
export const categoryBreakdown = (callback: (categories: CategoryCount[]) => void): Unsubscribe => {
    let categories: CategoryFirebase[] | undefined;
    let tickets: TicketFirebase[] | undefined;

    const envoyerResultat = () => {
        if (!categories || !tickets) return; // on attend d'avoir reçu les deux nœuds

        const nbrParCategorie = new Map<number, number>();
        tickets.forEach((ticket) => {
            nbrParCategorie.set(ticket.id_category, (nbrParCategorie.get(ticket.id_category) ?? 0) + 1);
        });

        callback(
            categories
                .map((category) => ({
                    id_category: category.id_category,
                    category_name: category.category_name,
                    nbrTickets: nbrParCategorie.get(category.id_category) ?? 0,
                    is_active: category.is_active,
                }))
                .filter((category) => category.is_active || category.nbrTickets > 0)
                .map(({ is_active: _isActive, ...category }) => category)
                .sort((a, b) => b.nbrTickets - a.nbrTickets),
        );
    };

    const stopCategories = onValue(
        ref(database, "categories"),
        (snapshot) => {
            const liste: CategoryFirebase[] = [];
            snapshot.forEach((category) => {
                liste.push(category.val());
            });
            categories = liste;
            envoyerResultat();
        },
        (error) => console.error("Impossible de lire les catégories :", error),
    );

    const stopTickets = onValue(
        ref(database, "tickets"),
        (snapshot) => {
            const liste: TicketFirebase[] = [];
            snapshot.forEach((ticket) => {
                liste.push(ticket.val());
            });
            tickets = liste;
            envoyerResultat();
        },
        (error) => console.error("Impossible de lire les tickets par catégorie :", error),
    );

    return () => {
        stopCategories();
        stopTickets();
    };
};

// fonction gestion du flux dactivité

export type ActivityType =
    | "CREATION"
    | "STATUT"
    | "PRIORITE"
    | "AFFECTATION"
    | "RESOLUTION"
    | "CLOTURE"
    | "COMPTE"
    | "MODIFICATION";

export interface ActivityEvent {
    id: string;
    type: ActivityType;
    date: Date;
    auteur: string | null;
    message: string;
}

// Une action d'historique, quel que soit le nœud d'où elle vient
interface ChangementTicket {
    id: string;
    ticket: string;
    champ: string;
    ancienneValeur: string | null;
    nouvelleValeur: string | null;
    date: Date;
    auteur: string | null;
}

const ACTIVITY_NODES = ["tickets", "ticket_history", "history", "profiles", "status", "priorities"] as const;
type ActivityNode = (typeof ACTIVITY_NODES)[number];

// Un nœud Firebase peut arriver sous forme de liste ou d'objet : on obtient toujours une liste
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lignes = (noeud: unknown): any[] => Object.values(noeud ?? {}).filter(Boolean);

const changementEnEvenement = (changement: ChangementTicket): ActivityEvent => {
    const { id, ticket, champ, ancienneValeur, nouvelleValeur, date, auteur } = changement;
    const evenement = { id, date, auteur };

    if (champ === "statut") {
        const type = nouvelleValeur === "Clôturé" ? "CLOTURE" : nouvelleValeur === "Résolu" ? "RESOLUTION" : "STATUT";
        return { ...evenement, type, message: `${ticket} : statut ${ancienneValeur ?? "—"} → ${nouvelleValeur ?? "—"}` };
    }
    if (champ === "priorité") {
        return { ...evenement, type: "PRIORITE", message: `${ticket} : priorité ${ancienneValeur ?? "—"} → ${nouvelleValeur ?? "—"}` };
    }
    if (champ === "technicien") {
        const message = ancienneValeur
            ? `${ticket} : technicien ${ancienneValeur} → ${nouvelleValeur ?? "aucun"}`
            : `${ticket} affecté à ${nouvelleValeur}`;
        return { ...evenement, type: "AFFECTATION", message };
    }
    return { ...evenement, type: "MODIFICATION", message: `${ticket} : ${champ} modifié` };
};

const construireActivites = (donnees: Record<ActivityNode, unknown>): ActivityEvent[] => {
    const profils = new Map<string, string>();
    lignes(donnees.profiles).forEach((profil) => profils.set(String(profil.id_profile), profil.full_name));

    const statuts = new Map<string, string>();
    lignes(donnees.status).forEach((statut) => statuts.set(String(statut.id_status), statut.status_name));

    const priorites = new Map<string, string>();
    lignes(donnees.priorities).forEach((priorite) => priorites.set(String(priorite.id_priority), priorite.priority_name));

    const nomProfil = (id: unknown): string | null => (id == null ? null : (profils.get(String(id)) ?? null));

    // ticket_history stocke des numéros : on les remplace par le texte correspondant
    const NOMS_CHAMPS: Record<string, { champ: string; texte: (valeur: string) => string }> = {
        id_status: { champ: "statut", texte: (valeur) => statuts.get(valeur) ?? valeur },
        id_priority: { champ: "priorité", texte: (valeur) => priorites.get(valeur) ?? valeur },
        id_technician: { champ: "technicien", texte: (valeur) => profils.get(valeur) ?? `technicien n°${valeur}` },
    };

    const creationsTickets: ActivityEvent[] = lignes(donnees.tickets).map((ticket) => ({
        id: `ticket-${ticket.id_ticket}`,
        type: "CREATION",
        date: new Date(ticket.created_at),
        auteur: nomProfil(ticket.id_author),
        message: `Ticket #${ticket.id_ticket} créé : ${ticket.title}`,
    }));

    const historiqueTickets = lignes(donnees.ticket_history).map((ligne) => {
        const champ = NOMS_CHAMPS[ligne.field];
        return changementEnEvenement({
            id: `ticket_history-${ligne.id_ticket_history}`,
            ticket: `Ticket #${ligne.id_ticket}`,
            champ: champ?.champ ?? ligne.field,
            ancienneValeur: ligne.old_value == null ? null : (champ?.texte(ligne.old_value) ?? ligne.old_value),
            nouvelleValeur: ligne.new_value == null ? null : (champ?.texte(ligne.new_value) ?? ligne.new_value),
            date: new Date(ligne.updated_at),
            auteur: nomProfil(ligne.id_profile),
        });
    });

    // "history" : history/<ticket>/<clé> avec "Statut" ou "Priorité" et des valeurs déjà en texte
    const historiquePageDetail = Object.entries((donnees.history ?? {}) as Record<string, unknown>).flatMap(
        ([idTicket, entrees]) =>
            Object.entries((entrees ?? {}) as Record<string, Record<string, never>>).map(([cle, ligne]) =>
                changementEnEvenement({
                    id: `history-${idTicket}-${cle}`,
                    ticket: /^\d+$/.test(idTicket) ? `Ticket #${idTicket}` : "Ticket",
                    champ: String(ligne.field).toLowerCase(),
                    ancienneValeur: ligne.old_value ?? null,
                    nouvelleValeur: ligne.new_value ?? null,
                    date: new Date(ligne.updated_at),
                    auteur: (ligne.changed_by as { name?: string } | undefined)?.name ?? null,
                }),
            ),
    );

    const creationsComptes: ActivityEvent[] = lignes(donnees.profiles).map((profil) => ({
        id: `compte-${profil.id_profile}`,
        type: "COMPTE",
        date: new Date(profil.created_at ?? profil.createdAt),
        auteur: null,
        message: `Nouveau compte créé : ${profil.full_name}`,
    }));

    return [...creationsTickets, ...historiqueTickets, ...historiquePageDetail, ...creationsComptes]
        .filter((evenement) => !Number.isNaN(evenement.date.getTime()))
        .sort((a, b) => b.date.getTime() - a.date.getTime());
};

// Écoute tous les nœuds où une action laisse une trace et renvoie les événements, du plus récent au plus ancien.
// callback est rappelé dès que l'un de ces nœuds change.
export const activityFlux = (callback: (evenements: ActivityEvent[]) => void): Unsubscribe => {
    const donnees: Partial<Record<ActivityNode, unknown>> = {};

    const stops = ACTIVITY_NODES.map((noeud) =>
        onValue(
            ref(database, noeud),
            (snapshot) => {
                donnees[noeud] = snapshot.val();
                if (ACTIVITY_NODES.every((nom) => nom in donnees)) {
                    callback(construireActivites(donnees as Record<ActivityNode, unknown>));
                }
            },
            (error) => console.error(`Impossible de lire le flux d'activité (${noeud}) :`, error),
        ),
    );

    return () => stops.forEach((stop) => stop());
};