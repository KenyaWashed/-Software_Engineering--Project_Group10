import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import furnitureRoutes from './routes/furniture.js';
import furnitureItemsRoutes from './routes/furnitureItems.js';
import furnitureItemsByRoomTypeRoutes from './routes/furnitureItemsByRoomType.js';
import policiesRouter from './routes/policies.js';

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);
  app.use('/api/furniture', furnitureRoutes);
  app.use('/api/furniture-items', furnitureItemsRoutes);
  app.use('/api/furniture-items-by-room-type', furnitureItemsByRoomTypeRoutes);
  app.use('/policies', policiesRouter);

  return app;
}
