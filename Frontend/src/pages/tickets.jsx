import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { TicketsContext } from "../contexts/TicketsContext.jsx";

export default function Tickets() {
  const {
    tickets,
    page,
    pages,
    loading,
    setPage,
    fetchTickets,
    priority,
    setPriority,
  } = useContext(TicketsContext);

  const [form, setForm] = useState({ title: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  // fetch on mount and when page or priority changes
  useEffect(() => {
    fetchTickets(page, priority);
  }, [fetchTickets, page, priority]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/tickets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form), // only title & description
        }
      );
      const data = await res.json();
      if (res.ok) {
        setForm({ title: "", description: "" });
        setPage(1);
        fetchTickets(1, priority);
      } else {
        alert(data.message || "Ticket creation failed");
      }
    } catch (err) {
      alert("Error creating ticket");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-3 mb-8">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Ticket Title"
          className="input input-bordered w-full"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Ticket Description"
          className="textarea textarea-bordered w-full"
          required
        />
        {/* priority is auto-assigned by AI */}
        <button
          className="btn btn-primary"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Filter by Priority</h2>
      <select
        className="select mb-6"
        value={priority}
        onChange={(e) => {
          setPriority(e.target.value);
          setPage(1);
        }}
      >
        <option value="">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <h2 className="text-xl font-semibold mb-2">All Tickets</h2>
      {loading ? (
        <p>Loading tickets…</p>
      ) : (
        <>
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <Link
                key={ticket._id}
                className="card shadow-md p-4 bg-gray-400"
                to={`/tickets/${ticket._id}`}
              >
                <h3 className="font-bold text-lg">{ticket.title}</h3>
                <p className="text-sm">{ticket.description}</p>
                <p className="text-sm">Priority: {ticket.priority}</p>
                <p className="text-sm text-gray-800">
                  Created At: {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </Link>
            ))}
            {tickets.length === 0 && <p>No tickets found.</p>}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <button
              className="btn btn-outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </button>
            <span>
              Page {page} of {pages}
            </span>
            <button
              className="btn btn-outline"
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(p + 1, pages))}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
