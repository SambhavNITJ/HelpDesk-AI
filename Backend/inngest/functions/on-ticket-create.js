// src/ingest/functions/onTicketCreated.js
import { inngest }   from "../client.js";
import Ticket        from "../../models/ticket.js";
import analyzeTicket from "../../utils/ai.js";

export const onTicketCreated = inngest.createFunction(
  { id: "on-ticket-created", retries: 2 },
  { event: "ticket/created" },
  async ({ event }) => {
    const { ticketId, title, description } = event.data;

    // 1) ask AI to pick a priority based on title+description
    const aiOutput = await analyzeTicket({
      prompt: `Given this ticket title & description, choose its priority (low, medium, or high).  Reply in JSON: { "priority": "..." }`,
      data: { title, description }
    });

    // 2) extract the priority label (ensure it’s one of your enum)
    const priority = ["low","medium","high"].includes(aiOutput.priority)
      ? aiOutput.priority
      : "medium";

    // 3) update the ticket document
    await Ticket.findByIdAndUpdate(ticketId, { priority });

    return { ok: true };
  }
);
