// controllers/ticket.js
import { inngest } from "../inngest/client.js";
import Ticket from "../models/ticket.js";

export const createTicket = async (req, res) => {
  try {
    const { title, description, priority = "medium" } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    // create ticket with priority
    const newTicket = await Ticket.create({
      title,
      description,
      priority,
      createdBy: req.user._id.toString(),
    });

    await inngest.send({
      name: "ticket/created",
      data: {
        ticketId: newTicket._id.toString(),
        title,
        description,
        priority,
        createdBy: req.user._id.toString(),
      },
    });

    return res.status(201).json({
      message: "Ticket created and processing started",
      ticket: newTicket,
    });
  } catch (error) {
    console.error("Error creating ticket", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTickets = async (req, res) => {
  try {
    const user = req.user;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const skip = (page - 1) * limit;

    let baseQuery;
    if (user.role !== "user") {
      baseQuery = Ticket.find({});
    } else {
      baseQuery = Ticket.find({ createdBy: user._id }).select(
        "title description status priority createdAt"
      );
    }

    const total = await baseQuery.clone().countDocuments();

    let query = baseQuery
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (user.role !== "user") {
      query = query.populate({ path: "assignedTo", select: "email _id" });
    }

    const tickets = await query.lean();
    const pages = Math.ceil(total / limit);

    return res.status(200).json({ tickets, total, page, pages });
  } catch (error) {
    console.error("Error fetching tickets", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getTicket = async (req, res) => {
  try {
    const user = req.user;
    let ticket;

    if (user.role !== "user") {
      ticket = await Ticket.findById(req.params.id)
        .populate("assignedTo", ["email", "_id"]);
    } else {
      ticket = await Ticket.findOne({
        createdBy: user._id,
        _id: req.params.id,
      })
      .select("title description status createdAt priority");
    }

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    return res.status(200).json({ ticket });
  } catch (error) {
    console.error("Error fetching ticket", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
