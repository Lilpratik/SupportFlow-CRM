function analyzeTicketFallback(ticket) {
    const text = `
        ${ticket.subject}
        ${ticket.description}
    `.toLowerCase();

    let priority = "Low";
    let category = "General Support";

    // Priority detection
    const highPriorityKeywords = [
        "payment",
        "charged",
        "money deducted",
        "fraud",
        "security",
        "urgent",
        "account blocked",
    ];

    const mediumPriorityKeywords = [
        "refund",
        "cancel",
        "delivery",
        "shipping",
        "wrong product",
    ];

    if (
        highPriorityKeywords.some((keyword) =>
            text.includes(keyword)
        )
    ) {
        priority = "High";
    } else if (
        mediumPriorityKeywords.some((keyword) =>
            text.includes(keyword)
        )
    ) {
        priority = "Medium";
    }

    // Category detection
    if (
        text.includes("payment") ||
        text.includes("charged") ||
        text.includes("money deducted")
    ) {
        category = "Payment Issue";
    } else if (
        text.includes("refund") ||
        text.includes("money back")
    ) {
        category = "Refund";
    } else if (
        text.includes("delivery") ||
        text.includes("shipping") ||
        text.includes("arrive")
    ) {
        category = "Delivery";
    } else if (
        text.includes("wrong product") ||
        text.includes("wrong item")
    ) {
        category = "Order Issue";
    }

    const summary = `Customer reported an issue regarding "${ticket.subject}".`;

    return {
        summary,
        priority,
        category,
        source: "fallback",
    };
}

module.exports = {
    analyzeTicketFallback,
};