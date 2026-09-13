const express = require("express");
const cors = require("cors");
require("dotenv").config();

const supabase = require("./config/supabase");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.json({
        message: "SupportFlow CRM API is running",
    });
});

app.use("/api/tickets", ticketRoutes);

// Database connection test
app.get("/api/health", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("tickets")
            .select("id")
            .limit(1);

        if (error) {
            throw error;
        }

        res.json({
            success: true,
            service: "SupportFlow CRM API",
            database: "connected",
        });
    } catch (error) {
        console.error("Database health check failed:", error);

        res.status(500).json({
            success: false,
            database: "connection failed",
            error: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});