const supabase = require("../config/supabase");
// const openai = require("../config/openai");
const gemini = require("../config/gemini");
const {
    analyzeTicketFallback,
} = require("../services/aiFallback");

const analyzeTicket = async (req, res) => {
    try {
        const { ticket_id } = req.params;

        // Fetch ticket
        const { data: ticket, error: ticketError } = await supabase
            .from("tickets")
            .select(
                "ticket_id, customer_name, subject, description, status"
            )
            .eq("ticket_id", ticket_id)
            .maybeSingle();

        if (ticketError) {
            throw ticketError;
        }

        if (!ticket) {
            return res.status(404).json({
                success: false,
                error: "Ticket not found",
            });
        }
        const prompt = `
Analyze this customer support ticket.

Ticket ID: ${ticket.ticket_id}
Customer: ${ticket.customer_name}
Subject: ${ticket.subject}
Description: ${ticket.description}
Current Status: ${ticket.status}

Provide:
- a concise one or two sentence summary
- a priority based only on the issue described
- a short support category

Use only the information provided.
Do not invent facts.
`.trim();

        // try {
        //     const response = await gemini.models.generateContent({
        //         model: "gemini-3.8-flash",
        //         contents: prompt,
        //     });

        //     return res.status(200).json({
        //         success: true,
        //         ticket_id,
        //         source: "ai",
        //         analysis: response.text,
        //     });

        // } catch (aiError) {
        //     console.error(
        //         "AI provider unavailable. Using fallback:",
        //         aiError.message
        //     );

        //     const fallback = analyzeTicketFallback(ticket);

        //     return res.status(200).json({
        //         success: true,
        //         ticket_id,
        //         source: fallback.source,
        //         analysis: fallback,
        //     });
        // }




        try {
            let response;
            let lastError;

            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    response = await gemini.models.generateContent({
                        model: "gemini-3.8-flash",
                        contents: prompt,
                        config: {
                            responseMimeType: "application/json",
                            responseSchema: {
                                type: "object",
                                properties: {
                                    summary: {
                                        type: "string",
                                        description: "One or two sentence summary of the customer issue.",
                                    },
                                    priority: {
                                        type: "string",
                                        enum: ["Low", "Medium", "High"],
                                        description: "Priority assigned based only on the ticket information.",
                                    },
                                    category: {
                                        type: "string",
                                        description: "Short support category.",
                                    },
                                },
                                required: ["summary", "priority", "category"],
                            },
                        },
                    });

                    break;
                } catch (error) {
                    lastError = error;

                    console.error(`Gemini attempt ${attempt} failed:`, error.message);

                    // Only retry temporary provider failures
                    if (
                        !error.message?.includes("503") &&
                        !error.message?.includes("UNAVAILABLE")
                    ) {
                        throw error;
                    }

                    if (attempt < 3) {
                        // 2 seconds, then 4 seconds
                        await new Promise(resolve =>
                            setTimeout(resolve, 2000 * attempt)
                        );
                    }
                }
            }

            if (!response) {
                throw lastError;
            }

            const analysis = JSON.parse(response.text);

            return res.status(200).json({
                success: true,
                ticket_id,
                source: "ai",
                analysis,
            });

        } catch (aiError) {
            console.error(
                "Gemini unavailable after retries. Using fallback:",
                aiError.message
            );

            const fallback = analyzeTicketFallback(ticket);

            return res.status(200).json({
                success: true,
                ticket_id,
                source: "fallback",
                analysis: fallback,
            });
        }


    } catch (error) {
        console.error("Ticket analysis error:", error);

        return res.status(500).json({
            success: false,
            error: "Failed to analyze ticket",
        });
    }
};

module.exports = {
    analyzeTicket,
};