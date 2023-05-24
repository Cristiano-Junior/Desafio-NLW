import "dotenv/config";

import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { memoriesRoutes } from "./routes/memories";
import { authRoutes } from "./routes/auth";

const app = fastify();

app.register(cors, {
  origin: true, // qualquer URL pode chamar
  // origin: ["http://localhost:3000", "https://meusite.producao.com.br"], // limitando quem pode chamar a API
});

app.register(jwt, {
  secret: "dhjadjksaAJSHDJAks21asdJDSHJAH12ik",
});

app.register(authRoutes);
app.register(memoriesRoutes);

app
  .listen({
    port: 3333,
    host: "0.0.0.0", // para funcionar no mobile
  })
  .then(() => {
    console.log("🚀 HTTP server running on http://localhost:3333");
  });
