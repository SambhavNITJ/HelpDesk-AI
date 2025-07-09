import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
    trim: true,
  },

  status: {
    type: String,
    enum: ["TODO", "IN_PROGRESS", "DONE"],
    default: "TODO",
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },

  deadline: {
    type: Date,
    default: null,
  },

  helpfulNotes: {
    type: String,
    default: "",
    trim: true,
  },

  relatedSkills: {
    type: [String],
    default: [],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// (Optional) Index priority and status to speed up queries:
ticketSchema.index({ priority: 1 });
ticketSchema.index({ status: 1 });

export default mongoose.model("Ticket", ticketSchema);
