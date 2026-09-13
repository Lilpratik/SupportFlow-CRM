import { useEffect, useState } from "react";
import CreateTicket from "./components/CreateTicket";
import TicketDetails from "./components/TicketDetails";
import { getTickets } from "./services/ticketApi";


function App() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets();
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [search, status]);

  async function fetchTickets() {
    try {
      setLoading(true);
      setError("");

      const data = await getTickets({
        search,
        status,
      });

      setTickets(data);
    } catch (error) {
      console.error(error);
      setError(error.message || "Unable to load tickets");
    } finally {
      setLoading(false);
    }
  }

  // const filteredTickets = tickets.filter((ticket) => {
  //   const matchesStatus =
  //     status === "All" || ticket.status === status;

  //   const searchValue = search.toLowerCase().trim();

  //   const matchesSearch =
  //     !searchValue ||
  //     ticket.ticket_id.toLowerCase().includes(searchValue) ||
  //     ticket.customer_name.toLowerCase().includes(searchValue) ||
  //     ticket.customer_email.toLowerCase().includes(searchValue) ||
  //     ticket.subject.toLowerCase().includes(searchValue) ||
  //     ticket.description.toLowerCase().includes(searchValue);

  //   return matchesStatus && matchesSearch;
  // });

  if (currentPage === "details" && selectedTicketId) {
    return (
      <div className="min-h-screen">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <h1 className="text-2xl font-bold text-slate-900">
              SupportFlow
            </h1>

            <p className="text-sm text-slate-500">
              Customer Support CRM
            </p>
          </div>
        </header>

        <main className="px-6 py-8">
          <TicketDetails
            ticketId={selectedTicketId}
            onBack={() => {
              setSelectedTicketId(null);
              setCurrentPage("dashboard");
              fetchTickets();
            }}
          />
        </main>
      </div>
    );
  }

  if (currentPage === "create") {
    return (
      <div className="min-h-screen">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <h1 className="text-2xl font-bold text-slate-900">
              SupportFlow
            </h1>

            <p className="text-sm text-slate-500">
              Customer Support CRM
            </p>
          </div>
        </header>

        <main className="px-6 py-8">
          <CreateTicket
            onCancel={() => setCurrentPage("dashboard")}
            onCreated={() => {
              fetchTickets();
              setCurrentPage("dashboard");
            }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              SupportFlow
            </h1>

            <p className="text-sm text-slate-500">
              Customer Support CRM
            </p>
          </div>

          <button
            onClick={() => setCurrentPage("create")}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            + New Ticket
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Support Dashboard
          </h2>

          <p className="mt-1 text-slate-500">
            Manage and track customer support tickets.
          </p>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Total Tickets
            </p>

            <p className="mt-2 text-3xl font-bold">
              {tickets.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              Open
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {tickets.filter((ticket) => ticket.status === "Open").length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">
              In Progress
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              {
                tickets.filter(
                  (ticket) => ticket.status === "In Progress"
                ).length
              }
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-slate-500"
            />

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="rounded-lg border border-slate-300 px-4 py-2 outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

            <p className="mt-4 text-sm text-slate-500">
              Loading tickets...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr className="text-left text-sm text-slate-500">
                    <th className="px-6 py-4 font-medium">
                      Ticket
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Customer
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Subject
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Status
                    </th>

                    <th className="px-6 py-4 font-medium">
                      Created
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket.ticket_id}
                      onClick={() => {
                        setSelectedTicketId(ticket.ticket_id);
                        setCurrentPage("details");
                      }}
                      className="cursor-pointer border-b border-slate-100 last:border-b-0 hover:bg-slate-50"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {ticket.ticket_id}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">
                          {ticket.customer_name}
                        </div>

                        <div className="text-sm text-slate-500">
                          {ticket.customer_email}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-700">
                        {ticket.subject}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          {ticket.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(
                          ticket.created_at
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {tickets.length === 0 && !loading && (
              <div className="p-10 text-center">
                <div className="mx-auto max-w-md">
                  <h3 className="text-lg font-semibold text-slate-800">
                    No tickets found
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    {search || status !== "All"
                      ? "Try changing your search or status filter."
                      : "Create your first support ticket to get started."}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;