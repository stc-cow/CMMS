import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import cowsRouter from "./routes/cows";
import { startPeriodicSync } from "./sync";
import { seedSampleData } from "./seed";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Seed sample data for initial testing
  console.log("[SERVER] Checking for existing data...");
  seedSampleData();

  // Start periodic COW data sync (every 15 minutes)
  startPeriodicSync(15);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // COW Registry API routes
  app.use("/api/cows", cowsRouter);

  return app;
}
