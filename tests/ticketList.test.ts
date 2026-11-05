import { describe, it, expect } from "vitest";
import {
  isClosed,
  countTickets,
  filterTickets,
  searchTickets,
  sortTickets,
  totalPages,
  paginate,
} from "../src/components/utils/ticketList";
import type { Ticket } from "../src/components/types/ticket";
import { PRIORITY_WEIGHT, PAGE_SIZE } from "../src/components/types/ticket";

const makeTicket = (overrides: Partial<Ticket> = {}): Ticket => ({
  id: 1,
  title: "Ticket par défaut",
  description: "Description",
  status: "open",
  priority: "medium",      
  category: "bug",
  author: "user-1",
  technician: null,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
  ...overrides,
} as Ticket);

// Récupère les clés de priorité triées par poids croissant
const priorityKeys = Object.keys(PRIORITY_WEIGHT) as Ticket["priority"][];
const lowestPriority = priorityKeys.reduce((a, b) =>
  PRIORITY_WEIGHT[a] < PRIORITY_WEIGHT[b] ? a : b
);

const highestPriority = priorityKeys.reduce((a, b) =>
  PRIORITY_WEIGHT[a] > PRIORITY_WEIGHT[b] ? a : b
);

// =====================================================================
// isClosed
// =====================================================================
describe("isClosed", () => {
  it("should return true when status is 'closed'", () => {
    expect(isClosed(makeTicket({ status: "closed" }))).toBe(true);
  });

  it("should return false when status is 'resolved", () => {
    expect(isClosed(makeTicket({ status: "resolved" }))).toBe(false);
  });

  it("should return false for any other status", () => {
    expect(isClosed(makeTicket({ status: "in_progress" }))).toBe(false);
    expect(isClosed(makeTicket({ status: "new" }))).toBe(false);
  });
});

// =====================================================================
// countTickets
// =====================================================================
describe("countTickets", () => {
  it("should return all zeros for an empty array", () => {
    expect(countTickets([])).toEqual({ all: 0, open: 0, closed: 0 });
  });

  it("should count a mix of open and closed tickets", () => {
    const tickets = [
      makeTicket({ id: 1, status: "in_progress" }),
      makeTicket({ id: 2, status: "closed" }),
      makeTicket({ id: 3, status: "in_progress" }),
      makeTicket({ id: 4, status: "closed" }),
      makeTicket({ id: 5, status: "in_progress" }),
    ];

    expect(countTickets(tickets)).toEqual({
      all: 5,
      open: 3,
      closed: 2,
    });
  });
    it("should count correctly when all tickets are closed", () => {
    const tickets = [
      makeTicket({ status: "closed" }),
      makeTicket({ status: "closed" }),
    ];

    expect(countTickets(tickets)).toEqual({ all: 2, open: 0, closed: 2 });
  });

  it("should count correctly when all tickets are open", () => {
    const tickets = [
      makeTicket({ status: "in_progress" }),
      makeTicket({ status: "new" }),
    ];

    expect(countTickets(tickets)).toEqual({ all: 2, open: 2, closed: 0 });
  });
});

// =====================================================================
// filterTickets
// =====================================================================
describe("filterTickets", () => {
  const tickets = [
    makeTicket({ id: 1, status: "new" }),
    makeTicket({ id: 2, status: "closed" }),
    makeTicket({ id: 3, status: "in_progress" }),
  ];

  it("should return all tickets when filter is 'all'", () => {
    expect(filterTickets(tickets, "all")).toEqual(tickets);
  });

  it("should return only non-closed tickets when filter is 'open'", () => {
    const result = filterTickets(tickets, "open");
    expect(result).toHaveLength(2);
    expect(result.every((t) => t.status !== "closed")).toBe(true);
  });

  it("should return only closed tickets when filter is 'closed'", () => {
    const result = filterTickets(tickets, "closed");
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("closed");
  });

  it("should return an empty array when no tickets match", () => {
    const allOpen = [makeTicket({ status: "new" })];
    expect(filterTickets(allOpen, "closed")).toEqual([]);
  });

  it("should return an empty array for an empty input", () => {
    expect(filterTickets([], "all")).toEqual([]);
  });
});

// =====================================================================
// sortTickets
// =====================================================================
describe("sortTickets", () => {
  it("should sort by updatedAt descending (most recent first)", () => {
    const tickets = [
      makeTicket({ id: 1, updatedAt: new Date("2024-01-01") }),
      makeTicket({ id: 2, updatedAt: new Date("2024-06-15") }),
      makeTicket({ id: 3, updatedAt: new Date("2024-03-10") }),
    ];

    const result = sortTickets(tickets, "updatedAt");

    expect(result.map((t) => t.id)).toEqual([2, 3, 1]);
  });

  it("should sort by priority descending (highest weight first)", () => {
    const tickets = [
      makeTicket({ id: 1, priority: lowestPriority }),
      makeTicket({ id: 2, priority: highestPriority }),
    ];

    const result = sortTickets(tickets, "priority");

    expect(result[0].id).toBe(2);
    expect(result[1].id).toBe(1);
  });

  it("should sort by id descending (largest first)", () => {
    const tickets = [
      makeTicket({ id: 5 }),
      makeTicket({ id: 42 }),
      makeTicket({ id: 1 }),
    ];

    const result = sortTickets(tickets, "id");

    expect(result.map((t) => t.id)).toEqual([42, 5, 1]);
  });

  it("should NOT mutate the original array", () => {
    const tickets = [
      makeTicket({ id: 3 }),
      makeTicket({ id: 1 }),
      makeTicket({ id: 2 }),
    ];
    const originalOrder = tickets.map((t) => t.id);

    sortTickets(tickets, "id");

    expect(tickets.map((t) => t.id)).toEqual(originalOrder);
  });

  it("should handle an empty array", () => {
    expect(sortTickets([], "id")).toEqual([]);
  });

  it("should handle a single-element array", () => {
    const tickets = [makeTicket({ id: 7 })];
    expect(sortTickets(tickets, "priority")).toEqual(tickets);
  });
});