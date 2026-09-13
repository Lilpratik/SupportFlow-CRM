const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    throw new Error("VITE_API_URL is not configured");
}

async function handleResponse(response) {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
    }

    return data;
}

export async function getTickets({ status = "", search = "" } = {}) {
    const params = new URLSearchParams();

    if (status && status !== "All") {
        params.append("status", status);
    }

    if (search.trim()) {
        params.append("search", search.trim());
    }

    const queryString = params.toString();

    const url = queryString
        ? `${API_URL}/tickets?${queryString}`
        : `${API_URL}/tickets`;

    const response = await fetch(url);

    return handleResponse(response);
}

export async function getTicket(ticketId) {
    const response = await fetch(
        `${API_URL}/tickets/${encodeURIComponent(ticketId)}`
    );

    return handleResponse(response);
}

export async function createTicket(ticketData) {
    const response = await fetch(`${API_URL}/tickets`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
    });

    return handleResponse(response);
}

export async function updateTicket(ticketId, updateData) {
    const response = await fetch(
        `${API_URL}/tickets/${encodeURIComponent(ticketId)}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        }
    );

    return handleResponse(response);
}


export async function analyzeTicket(ticketId) {
    const response = await fetch(
        `${API_URL}/ai/tickets/${encodeURIComponent(ticketId)}/analyze`,
        {
            method: "POST",
        }
    );

    return handleResponse(response);
}