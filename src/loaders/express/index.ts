import compression from "compression";
import cors from "cors";
import express, { Application, Request, Response, NextFunction } from "express";
import config from "@/config";
import { handleErrors, attachJWT } from "@/middlewares";
import mainRoutes from "@/routes";
import { AsyncHook } from "@/services";

export default function expressLoader(app: Application) {
  // Health Check endpoints
  app.get("/version", (_req: Request, res: Response) => {
    res.status(200).json({ version: "v1.0.0", name: "clinicflow-api" });
  });

  app.get("/status", (_req: Request, res: Response) => {
    res.status(200).json({
      uptime: process.uptime(),
      message: "Ok",
      date: new Date(),
    });
  });

  app.get("/env", (_req: Request, res: Response) => {
    res.status(200).json({ env: config.apiEnv, nodeEnv: config.nodeEnv });
  });

  app.get("/host", (req: Request, res: Response) => {
    res.status(200).json({ host: req.headers.host });
  });

  app.enable("trust proxy");

  app.use(cors({ origin: config.cors.origin, credentials: true }));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(compression());

  // Attach JWT middleware globally
  app.use(attachJWT);

  // Request context hook
  app.use((req: Request, _res: Response, next: NextFunction) => {
    const data = { originalUrl: req?.originalUrl };
    AsyncHook.createRequestContext(data);
    next();
  });

  // Mount API routes
  app.use(`${config.api.prefix}`, mainRoutes);

  // Catch 404 errors
  app.use((_req: Request, _res: Response, next: NextFunction) => {
    next({ success: false, status: 404, message: "Endpoint not found" });
  });

  // Central error handler
  app.use(handleErrors);
}
