import { useState } from "react";
import { createTicket } from "../services/ticketApi";

function CreateTicket({ onCreated, onCancel }) {
    const [formData, setFormData] = useState({
        customer_name: "",
        customer_email: "",
        subject: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const result = await createTicket(formData);

            setFormData({
                customer_name: "",
                customer_email: "",
                subject: "",
                description: "",
            });

            if (onCreated) {
                onCreated(result);
            }
        } catch (error) {
            console.error(error);
            setError(error.message || "Failed to create ticket.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="mb-4 text-sm font-medium text-slate-500 hover:text-slate-900"
                >
                    ← Back to dashboard
                </button>

                <h2 className="text-3xl font-bold text-slate-900">
                    Create Ticket
                </h2>

                <p className="mt-1 text-slate-500">
                    Create a new customer support ticket.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
                <div className="grid gap-5">
                    <div>
                        <label
                            htmlFor="customer_name"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Customer Name
                        </label>

                        <input
                            id="customer_name"
                            name="customer_name"
                            type="text"
                            value={formData.customer_name}
                            onChange={handleChange}
                            placeholder="Rahul Sharma"
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="customer_email"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Customer Email
                        </label>

                        <input
                            id="customer_email"
                            name="customer_email"
                            type="email"
                            value={formData.customer_email}
                            onChange={handleChange}
                            placeholder="rahul@gmail.com"
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="subject"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Issue Title
                        </label>

                        <input
                            id="subject"
                            name="subject"
                            type="text"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Payment failed"
                            required
                            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Issue Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the customer's issue..."
                            rows={7}
                            required
                            className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-100"
                        />
                    </div>
                </div>

                {error && (
                    <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {success}
                    </div>
                )}

                <div className="mt-6 flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Ticket"}
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateTicket;