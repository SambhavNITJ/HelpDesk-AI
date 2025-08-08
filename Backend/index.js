import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.js";
import ticketRoutes from "./routes/ticket.js";
import inngestHandler from "./inngest/inngesthandler.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", userRoutes);
app.use("/tickets", ticketRoutes);

// Local dev Inngest endpoint
app.use("/api/inngest", inngestHandler);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB error: ", err));
