import { createContext, useState, useCallback } from "react";

export const TicketsContext = createContext();

export function TicketsProvider({ children }) {
  const [tickets, setTickets] = useState([]);
  const [page, setPage]       = useState(1);
  const [pages, setPages]     = useState(1);
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState("");      // ← new
  const token = localStorage.getItem("token");
  const limit = 5;

  const fetchTickets = useCallback(
    async (pageToLoad = page, prio = priority) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: pageToLoad,
          limit: limit,
          ...(prio ? { priority: prio } : {}),
        });

        const res = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/tickets?${params}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setTickets(data.tickets);
          setPages(data.pages);
          setPage(data.page);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
      } finally {
        setLoading(false);
      }
    },
    [page, token, priority]
  );

  return (
    <TicketsContext.Provider
      value={{
        tickets,
        page,
        pages,
        loading,
        setPage,
        fetchTickets,
        priority,     
        setPriority, 
      }}
    >
      {children}
    </TicketsContext.Provider>
  );
}
