import { serve } from "inngest/express";
import { inngest } from "./client.js";
import { onUserSignup } from "./functions/on-signup.js";
import { onTicketCreated } from "./functions/on-ticket-create.js";

export default serve({
  client: inngest,
  functions: [onUserSignup, onTicketCreated],
});
