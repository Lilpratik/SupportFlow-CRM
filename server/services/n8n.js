async function sendTicketToN8n(ticket) {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
        console.log("N8N_WEBHOOK_URL not configured. Skipping automation.");
        return;
    }

    try {
        const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ticket_id: ticket.ticket_id,
                customer_name: ticket.customer_name,
                customer_email: ticket.customer_email,
                subject: ticket.subject,
                description: ticket.description,
                status: ticket.status,
                created_at: ticket.created_at,
            }),
        });

        if (!response.ok) {
            throw new Error(
                `n8n webhook returned HTTP ${response.status}`
            );
        }

        console.log(
            `Ticket ${ticket.ticket_id} sent to n8n successfully`
        );
    } catch (error) {
        console.error(
            `n8n webhook failed for ${ticket.ticket_id}:`,
            error.message
        );
    }
}

module.exports = {
    sendTicketToN8n,
};