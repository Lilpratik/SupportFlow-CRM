const express = require("express");
const { analyzeTicket } = require("../controllers/aiController");

const router = express.Router();

router.post("/tickets/:ticket_id/analyze", analyzeTicket);

module.exports = router;