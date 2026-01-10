import express from "express";

const app = express();

app.use(express.json());

// routes
// app.use("/api", routes);

export default app;
