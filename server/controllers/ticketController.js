const supabase = require("../config/supabase");
const {
    sendTicketToN8n,
} = require("../services/n8n");

// create Ticket 
const createTicket = async (req, res) => {
    try {
        const {
            customer_name,
            customer_email,
            subject,
            description,
        } = req.body;

        // Basic validation
        if (
            !customer_name?.trim() ||
            !customer_email?.trim() ||
            !subject?.trim() ||
            !description?.trim()
        ) {
            return res.status(400).json({
                success: false,
                error: "All fields are required",
            });
        }

        // email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(customer_email)) {
            return res.status(400).json({
                success: false,
                error: "Invalid customer email",
            });
        }

        // Get the latest ticket
        const { data: latestTicket, error: latestTicketError } = await supabase
            .from("tickets")
            .select("ticket_id")
            .order("id", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (latestTicketError) {
            throw latestTicketError;
        }

        // Generate next ticket number
        let nextNumber = 1;

        if (latestTicket?.ticket_id) {
            const lastNumber = parseInt(
                latestTicket.ticket_id.replace("TKT-", ""),
                10
            );

            if (!Number.isNaN(lastNumber)) {
                nextNumber = lastNumber + 1;
            }
        }

        const ticketId = `TKT-${String(nextNumber).padStart(3, "0")}`;

        // Insert ticket
        const { data: ticket, error: insertError } = await supabase
            .from("tickets")
            .insert({
                ticket_id: ticketId,
                customer_name: customer_name.trim(),
                customer_email: customer_email.trim().toLowerCase(),
                subject: subject.trim(),
                description: description.trim(),
            })
            .select("ticket_id, created_at")
            .single();

        if (insertError) {
            throw insertError;
        }

        // send to n8n automation
        await sendTicketToN8n(ticket);

        return res.status(201).json({
            ticket_id: ticket.ticket_id,
            created_at: ticket.created_at,
        });
    } catch (error) {
        console.error("Create ticket error:", error);

        return res.status(500).json({
            success: false,
            error: "Failed to create ticket",
        });
    }
};


// get ticket
const getTickets = async (req, res) => {
    try {
        const { status, search } = req.query;

        const allowedStatuses = ["Open", "In Progress", "Closed"];

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: "Invalid status. Use Open, In Progress, or Closed.",
            });
        }

        let query = supabase
            .from("tickets")
            .select("ticket_id, customer_name, customer_email, subject, status, created_at, description")
            .order("created_at", { ascending: false });

        // filter by status
        if (status) {
            query = query.eq("status", status);
        }

        // search across multiple fields
        if (search) {
            const searchValue = search.trim();

            if (searchValue) {
                query = query.or(
                    `ticket_id.ilike.%${searchValue}%,customer_name.ilike.%${searchValue}%,customer_email.ilike.%${searchValue}%,description.ilike.%${searchValue}%`
                );
            }
        }

        const { data: tickets, error } = await query;

        if (error) {
            throw error;
        }

        return res.status(200).json(tickets);
    } catch (error) {
        console.error("Get tickets error:", error);

        return res.status(500).json({
            success: false,
            error: "Failed to fetch tickets",
        });
    }
};


// get ticket by id 
const getTicketById = async (req, res) => {
    try {
        const { ticket_id } = req.params;

        // get the ticket 
        const { data: ticket, error: ticketError } = await supabase
            .from("tickets")
            .select(
                "ticket_id, customer_name, customer_email, subject, description, status, created_at, updated_at"
            )
            .eq("ticket_id", ticket_id)
            .maybeSingle();

        if (ticketError) {
            throw ticketError;
        }

        // ticket does not exist
        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: "Ticket not found",
            });
        }

        // get notes belonging to this ticket 
        const { data: notes, error: notesError } = await supabase
            .from("notes")
            .select("id, note_text, created_at")
            .eq("ticket_id", ticket_id)
            .order("created_at", { ascending: true });

        if (notesError) {
            throw notesError;
        }

        return res.status(200).json({
            ticket_id: ticket.ticket_id,
            customer_name: ticket.customer_name,
            customer_email: ticket.customer_email,
            subject: ticket.subject,
            description: ticket.description,
            status: ticket.status,
            created_at: ticket.created_at,
            updated_at: ticket.updated_at,
            notes: notes || [],
        });
    } catch (error) {
        console.error("Get ticket error:", error);

        return res.status(500).json({
            success: false,
            error: "Failed to fetch ticket",
        });
    }
};


// update ticket 
const updateTicket = async (req, res) => {
    try {
        const { ticket_id } = req.params;
        const { status, notes } = req.body;

        let updatedAt = null;

        // Validate that at least one field was provided
        if (!status && !notes) {
            return res.status(400).json({
                success: false,
                error: "Provide status or notes to update",
            });
        }

        // Validate status when provided
        const allowedStatuses = ["Open", "In Progress", "Closed"];

        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: "Invalid status",
            });
        }

        // Check that ticket exists
        const { data: existingTicket, error: ticketError } = await supabase
            .from("tickets")
            .select("ticket_id")
            .eq("ticket_id", ticket_id)
            .maybeSingle();

        if (ticketError) {
            throw ticketError;
        }

        if (!existingTicket) {
            return res.status(404).json({
                success: false,
                error: "Ticket not found",
            });
        }

        // Update ticket status
        if (status) {
            const { data: updatedTicket, error: updateError } = await supabase
                .from("tickets")
                .update({
                    status,
                })
                .eq("ticket_id", ticket_id)
                .select("updated_at")
                .single();

            if (updateError) {
                throw updateError;
            }

            updatedAt = updatedTicket.updated_at;
        }

        // Add note
        if (notes?.trim()) {
            const { error: noteError } = await supabase
                .from("notes")
                .insert({
                    ticket_id,
                    note_text: notes.trim(),
                });

            if (noteError) {
                throw noteError;
            }
        }

        if (notes?.trim() && !status) {
            const { data: ticketAfterNote, error: timestampError } =
                await supabase
                    .from("tickets")
                    .select("updated_at")
                    .eq("ticket_id", ticket_id)
                    .single();

            if (timestampError) {
                throw timestampError;
            }

            updatedAt = ticketAfterNote.updated_at;
        }

        return res.status(200).json({
            success: true,
            updated_at: updatedAt,
        });

    } catch (error) {
        console.error("Update ticket error:", error);

        return res.status(500).json({
            success: false,
            error: "Failed to update ticket",
        });
    }
};

module.exports = {
    createTicket,
    getTickets,
    getTicketById,
    updateTicket,
};