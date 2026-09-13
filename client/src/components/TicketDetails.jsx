import { useEffect, useState } from "react";
import {
    getTicket,
    updateTicket,
} from "../services/ticketApi";

function TicketDetails({ ticketId, onBack }) {
    const [ticket, setTicket] = useState(null);
    const [status, setStatus] = useState("");
    const [note, setNote] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadTicket();
    }, [ticketId]);

    async function loadTicket() {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const data = await getTicket(ticketId);

            setTicket(data);
            setStatus(data.status);
        } catch (error) {
            console.error(error);
            setError(error.message || "Failed to load ticket.");
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdateStatus() {
        try {
            setSaving(true);
            setError("");
            setSuccess("");

            await updateTicket(ticketId, {
                status,
            });

            setSuccess("Ticket status updated successfully.");

            await loadTicket();
        } catch (error) {
            console.error(error);
            setError(error.message || "Failed to update status.");
        } finally {
            setSaving(false);
        }
    }

    async function handleAddNote() {
        if (!note.trim()) {
            setError("Please enter a note.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            await updateTicket(ticketId, {
                notes: note.trim(),
            });

            setNote("");
            setSuccess("Note added successfully.");

            await loadTicket();
        } catch (error) {
            console.error(error);
            setError(error.message || "Failed to add note.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="mx-auto max-w-5xl p-8 text-center text-slate-500">
                Loading ticket...
            </div>
        );
    }

    if (error && !ticket) {
        return (
            <div className="mx-auto max-w-5xl p-8">
                <button
                    onClick={onBack}
                    className="mb-6 text-sm font-medium text-slate-500 hover:text-slate-900"
                >
                    ← Back to dashboard
                </button>

                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
                    {error}
                </div>
            </div>
        );
    }

    if (!ticket) {
        return null;
    }

    return (
        <div className="mx-auto max-w-5xl">
            <button
                onClick={onBack}
                className="mb-6 text-sm font-medium text-slate-500 hover:text-slate-900"
            >
                ← Back to dashboard
            </button>

            <div className="mb-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">
                            Ticket
                        </p>

                        <h2 className="text-3xl font-bold text-slate-900">
                            {ticket.ticket_id}
                        </h2>
                    </div>

                    <span
                        className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${ticket.status === "Open"
                            ? "bg-blue-100 text-blue-700"
                            : ticket.status === "In Progress"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-green-100 text-green-700"
                            }`}
                    >
                        {ticket.status}
                    </span>
                </div>
            </div>

            {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-6">
                            <p className="mb-2 text-sm font-medium text-slate-500">
                                Issue
                            </p>

                            <h3 className="text-2xl font-semibold text-slate-900">
                                {ticket.subject}
                            </h3>
                        </div>

                        <div>
                            <p className="mb-2 text-sm font-medium text-slate-500">
                                Description
                            </p>

                            <p className="whitespace-pre-wrap leading-7 text-slate-700">
                                {ticket.description}
                            </p>
                        </div>
                    </section>

                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-5">
                            <h3 className="text-lg font-semibold text-slate-900">
                                Internal Notes
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Notes for support team collaboration.
                            </p>
                        </div>

                        {ticket.notes.length === 0 ? (
                            <div className="rounded-lg bg-slate-50 p-5 text-sm text-slate-500">
                                No notes have been added yet.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {ticket.notes.map((item) => (
                                    <div
                                        key={item.id}
                                        className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                                    >
                                        <p className="text-sm leading-6 text-slate-700">
                                            {item.note_text}
                                        </p>

                                        <p className="mt-2 text-xs text-slate-400">
                                            {new Date(
                                                item.created_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="mt-5 border-t border-slate-200 pt-5">
                            <label
                                htmlFor="new-note"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Add Note
                            </label>

                            <textarea
                                id="new-note"
                                value={note}
                                onChange={(event) => setNote(event.target.value)}
                                placeholder="Add an internal note..."
                                rows={4}
                                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                            />

                            <button
                                onClick={handleAddNote}
                                disabled={saving}
                                className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Add Note"}
                            </button>
                        </div>
                    </section>
                </div>

                <aside className="space-y-6">
                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-5 text-lg font-semibold text-slate-900">
                            Customer
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Name
                                </p>

                                <p className="mt-1 font-medium text-slate-800">
                                    {ticket.customer_name}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Email
                                </p>

                                <p className="mt-1 break-words text-sm text-slate-700">
                                    {ticket.customer_email}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-5 text-lg font-semibold text-slate-900">
                            Ticket Status
                        </h3>

                        <label
                            htmlFor="status"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Status
                        </label>

                        <select
                            id="status"
                            value={status}
                            onChange={(event) => setStatus(event.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
                        >
                            <option value="Open">Open</option>
                            <option value="In Progress">
                                In Progress
                            </option>
                            <option value="Closed">Closed</option>
                        </select>

                        <button
                            onClick={handleUpdateStatus}
                            disabled={saving || status === ticket.status}
                            className="mt-3 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? "Updating..." : "Update Status"}
                        </button>
                    </section>

                    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="mb-5 text-lg font-semibold text-slate-900">
                            Timeline
                        </h3>

                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-slate-400">
                                    Created
                                </p>

                                <p className="font-medium text-slate-700">
                                    {new Date(
                                        ticket.created_at
                                    ).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-400">
                                    Last updated
                                </p>

                                <p className="font-medium text-slate-700">
                                    {new Date(
                                        ticket.updated_at
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}

export default TicketDetails;