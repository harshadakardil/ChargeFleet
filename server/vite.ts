import { createServer as createViteServer, InlineConfig, ViteDevServer, Logger } from "vite";
import viteConfig from "../vite.config";
import path from "path";
import fs from "fs";
import express, { type Express, Request, Response } from "express";

interface ServerOptions {
  middlewareMode: boolean;
}

const serverOptions: ServerOptions = {
  middlewareMode: true,
};

export async function setupVite(app: Express, server: any): Promise<ViteDevServer> {
  const viteLogger: Logger = {
    info: (msg) => console.log(msg),
    warn: (msg) => console.warn(msg),
    error: (msg) => console.error(msg),
    clearScreen: () => process.stdout.write('\x1Bc'),
    warnOnce: (msg) => console.warn(msg),
    hasErrorLogged: (error) => false,
    hasWarned: false
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: {
      middlewareMode: true,
      ...viteConfig.server
    },
    customLogger: viteLogger
  });

  app.use(vite.middlewares);
  return vite;
}

export function serveStatic(app: Express): void {
  const distPath = path.resolve(__dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));
  app.use("*", (_req: Request, res: Response) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

export function log(msg: string, options?: any): void {
  console.log(msg, options);
}