// @vitest-environment happy-dom
import { beforeEach, describe, it, expect, vi } from "vitest";
import { flushPromises, mount, RouterLinkStub } from "@vue/test-utils";
import { nextTick } from "vue";
import CategoryBreakdown from "../src/components/dashboard/CategoryBreakdown.vue";
import DashboardStats from "../src/components/dashboard/DashboardStats.vue";
import PriorityTicketsList from "../src/components/dashboard/PriorityTicketsList.vue";

interface Cible {
  noeud: string;
  champ?: string;
  valeur?: unknown;
}

// Base Firebase simulée en mémoire : les vrais services tournent sans toucher à la vraie base
const base = vi.hoisted(() => ({
  donnees: {} as Record<string, unknown[] | null>,
  ecouteurs: new Set<{ noeud: string; envoyer: () => void }>(),
}));

vi.mock("../src/services/firebase", () => ({ database: {} }));
vi.mock("firebase/database", () => {
  const snapshot = (cible: Cible) => {
    const lignes = ((base.donnees[cible.noeud] ?? []) as Record<string, unknown>[]).filter(
      (ligne) => !cible.champ || (ligne[cible.champ] ?? null) === cible.valeur,
    );

    return {
      size: lignes.length,
      forEach: (callback: (enfant: { val: () => unknown }) => void) => {
        lignes.forEach((ligne) => callback({ val: () => ligne }));
      },
    };
  };

  return {
    ref: (_database: unknown, noeud: string) => ({ noeud }),
    query: (cible: Cible, ordre: object, egal: object) => ({ ...cible, ...ordre, ...egal }),
    orderByChild: (champ: string) => ({ champ }),
    equalTo: (valeur: unknown) => ({ valeur }),
    get: async (cible: Cible) => snapshot(cible),
    onValue: (cible: Cible, callback: (instantane: unknown) => void) => {
      const ecouteur = { noeud: cible.noeud, envoyer: () => callback(snapshot(cible)) };
      base.ecouteurs.add(ecouteur);
      ecouteur.envoyer();
      return () => base.ecouteurs.delete(ecouteur);
    },
  };
});

// Modifie un nœud et prévient ses écouteurs, comme Firebase après une écriture
const ecrire = async (noeud: string, valeur: unknown[]) => {
  base.donnees[noeud] = valeur;
  base.ecouteurs.forEach((ecouteur) => {
    if (ecouteur.noeud === noeud) ecouteur.envoyer();
  });
  await nextTick();
};

// Par défaut : priorité moyenne, statut "Nouveau", sans technicien
const makeTicket = (overrides: Record<string, unknown> = {}) => ({
  id_ticket: 1,
  title: "Ticket",
  description: "Description",
  created_at: "2026-01-01T10:00:00.000Z",
  last_update: "2026-01-01T10:00:00.000Z",
  id_priority: 3,
  id_category: 1,
  id_status: 1,
  ...overrides,
});

beforeEach(() => {
  base.ecouteurs.clear();
  base.donnees = { tickets: null, categories: null, comments: null, profiles: null };
});

describe("Tableau de bord", () => {
  it("CT-05 a : comptage des tickets par catégorie", async () => {
    const ticketsDe = (id_category: number, nombre: number) =>
      Array.from({ length: nombre }, () => makeTicket({ id_category }));
    const tickets = [...ticketsDe(2, 3), ...ticketsDe(1, 5), ...ticketsDe(3, 2)];

    base.donnees.categories = [
      { id_category: 1, category_name: "Réseau", is_active: true },
      { id_category: 2, category_name: "Matériel", is_active: true },
      { id_category: 3, category_name: "Logiciel", is_active: true },
      { id_category: 4, category_name: "Accès", is_active: true },
      { id_category: 5, category_name: "Ancienne", is_active: false },
    ];
    base.donnees.tickets = tickets;

    const wrapper = mount(CategoryBreakdown);
    await nextTick();
    const lignes = () => wrapper.findAll("li").map((ligne) => ligne.text());

    expect(lignes()).toEqual(["Réseau5 tickets", "Matériel3 tickets", "Logiciel2 tickets", "Accès0 ticket"]);

    await ecrire("tickets", [...tickets, makeTicket({ id_category: 1 })]);

    expect(lignes()).toEqual(["Réseau6 tickets", "Matériel3 tickets", "Logiciel2 tickets", "Accès0 ticket"]);
  });

  it("CT-05 b : liste des tickets critiques à prendre en charge", async () => {
    base.donnees.tickets = [
      makeTicket({ id_ticket: 1, id_priority: 1, id_status: 2, created_at: "2026-01-01T10:00:00.000Z" }),
      makeTicket({ id_ticket: 2, id_priority: 1, id_status: 4, created_at: "2026-01-02T10:00:00.000Z" }),
      makeTicket({ id_ticket: 3, id_priority: 1, id_status: 3, created_at: "2026-01-03T10:00:00.000Z" }),
      makeTicket({ id_ticket: 4, id_priority: 1, id_technician: 7, created_at: "2026-01-04T10:00:00.000Z" }),
      makeTicket({ id_ticket: 5, id_priority: 2, created_at: "2026-01-05T10:00:00.000Z" }),
      makeTicket({ id_ticket: 6, id_priority: 1, created_at: "2026-01-09T10:00:00.000Z" }),
      makeTicket({ id_ticket: 7, id_priority: 1, created_at: "2026-01-06T10:00:00.000Z" }),
      makeTicket({ id_ticket: 8, id_priority: 1, created_at: "2026-01-08T10:00:00.000Z" }),
      makeTicket({ id_ticket: 9, id_priority: 1, created_at: "2026-01-07T10:00:00.000Z" }),
      makeTicket({ id_ticket: 10, id_priority: 1, created_at: "2026-01-10T10:00:00.000Z" }),
    ];

    const wrapper = mount(PriorityTicketsList, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    await flushPromises();

    const numeros = wrapper.findAll("tbody tr td:first-child").map((numero) => numero.text());
    expect(numeros).toEqual(["#7", "#9", "#8", "#6", "#10"]);

    await ecrire("tickets", []);

    expect(wrapper.find("tbody").text()).toBe("0 ticket à prendre en charge");
  });

  it("CT-05 c : compteurs du tableau de bord", async () => {
    base.donnees.tickets = [
      makeTicket({ id_ticket: 1, id_priority: 1 }),
      makeTicket({ id_ticket: 2, id_priority: 1, id_status: 2, id_technician: 7 }),
      makeTicket({ id_ticket: 3, id_priority: 1, id_status: 3, id_technician: 7 }),
      makeTicket({ id_ticket: 4, id_priority: 1, id_status: 4, id_technician: 7 }),
      makeTicket({ id_ticket: 5, id_status: 2 }),
      makeTicket({ id_ticket: 6, id_status: 4 }),
      makeTicket({ id_ticket: 7, id_status: 2, id_technician: 7 }),
      makeTicket({ id_ticket: 8 }),
    ];

    const wrapper = mount(DashboardStats);
    await nextTick();

    // Dans l'ordre des cartes : ouverts, critiques non résolus, sans technicien, résolus
    const valeurs = wrapper.findAll("p.text-3xl").map((valeur) => valeur.text());
    expect(valeurs).toEqual(["3", "2", "4", "1"]);
    expect(wrapper.text()).toContain("Tickets résolus");
    expect(wrapper.text()).toContain("sur 8 tickets enregistrés");
  });
});
