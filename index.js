const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const logger = require("./src/config/config").logger;
require("dotenv").config();

const port = process.env.PORT;

const dbconnection = require("./dbconnection");
const userRoutes = require("./src/routes/employee.routes");
const customerRoutes = require("./src/routes/customer.routes");
const authRoutes = require("./src/routes/auth.routes");
const workshopRoutes = require("./src/routes/workshop.routes");
const jobRoutes = require("./src/routes/job.routes");
const docentRoutes = require("./src/routes/docent.routes");

app.use(bodyParser.json());

app.all("*", (req, res, next) => {
    const method = req.method;

    logger.debug(`Method ${method} is aangeroepen`);
    next();
});

//Default route
app.get("/", (req, res) => {
    logger.debug("User is on default endpoint");
    res.status(200).json({
        status: 200,
        result: "Skool Workshop API",
    });
});

//Docent route
app.use("/api/docent", docentRoutes);

//User route
app.use("/api/user", userRoutes);

//Authentication route
app.use("/api/auth/", authRoutes);

//Workshop route
app.use("/api/workshop", workshopRoutes);

//Job route
app.use("/api/job", jobRoutes);

//Customer route
app.use("/api/customer", customerRoutes);

app.all("*", (req, res) => {
    res.status(401).json({
        status: 401,
        result: "End-point not found",
    });
});

//Error handler
app.use((err, req, res, next) => {
    logger.error(err);
    res.status(err.status).json(err);
});

//Welcome message
app.listen(port, () => {
    logger.debug(`API listening on port ${port}`);
});

process.on("SIGINT", () => {
    logger.debug("SIGINT signal received: closing HTTP server");
    dbconnection.end((err) => {
        logger.debug("Database connection closed");
    });
    app.close(() => {
        logger.debug("HTTP server closed");
    });
});

module.exports = app;