const express = require("express");
const {
    createTicket,
    getTickets,
    getTicketById,
    updateTicket,
} = require("../controllers/ticketController");

const router = express.Router();

router.post("/", createTicket);
router.get("/", getTickets);
router.get("/:ticket_id", getTicketById);
router.put("/:ticket_id", updateTicket);

module.exports = router;